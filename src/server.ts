import "reflect-metadata";

import { GraphQLError, GraphQLFormattedError } from "graphql";

import { ApolloError } from "apollo-server-errors";
import { ApolloServer } from "@apollo/server";
import { AuthService } from "./modules/auth/services/auth.service";
import { BadUserInputExceptionFilter } from "./shared/exceptions/filters/bad-user-input.exception.filter";
import Container from "typedi";
import { ExceptionFilterManager } from "./shared/exceptions/exception-filter-manager";
import Redis from "ioredis";
import { ValidationExceptionFilter } from "./shared/exceptions/filters/validation-exception-filter";
import { createSchema } from "./shared/graphql/schema";
import express from "express";
import { prismaClient } from "./shared/lib/prisma/prisma-client";
import { redisClient } from "./shared/redis/redis.client";
import { startStandaloneServer } from "@apollo/server/standalone";

async function bootstrap() {
  Container.set("prisma", prismaClient);
  Container.set("redisClient", redisClient);

  const schema = await createSchema();

  const server = new ApolloServer({
    schema,
    formatError: (formattedError) => {
      const { extensions, ...rest } = formattedError;

      const cleanExtensions = { ...extensions };

      if (cleanExtensions?.stacktrace) {
        delete cleanExtensions.stacktrace;
      }

      if (
        formattedError.message.includes("got invalid value") ||
        formattedError.message.includes("cannot represent a non") ||
        formattedError.message.includes("must not be null")
      ) {
        const match = formattedError.message.match(/\$(\w+)/);
        const field = match ? match[1] : "desconhecido";

        const fieldName = field.split(".").pop();

        // Para mensagens "cannot represent a non"
        const typeMatch1 = formattedError.message.match(
          /;\s*(\w+)\s+cannot represent a non/
        );

        // Para mensagens "must not be null", extrai o tipo dentro das aspas e retira o "!"
        const typeMatch2 = formattedError.message.match(
          /of non-null type "(\w+)!"/
        );

        const fieldType = typeMatch1
          ? typeMatch1[1]
          : typeMatch2
          ? typeMatch2[1]
          : "desconhecido";

        return {
          message: "Erro de validação",
          locations: formattedError.locations,
          path: formattedError.path,
          extensions: {
            code: "BAD_USER_INPUT",
            message: "Erro na validação dos dados",
            errors_details: [
              {
                property: fieldName,
                message: `${fieldName} deve ser do tipo ${fieldType.toLocaleLowerCase()}`,
              },
            ],
          },
        };
      }

      return {
        ...rest,
        extensions: cleanExtensions,
      };
    },
  });

  const app = express();

  const { url } = await startStandaloneServer(server, {
    listen: { port: Number(process.env.PORT) },
    context: async ({ req }) => {
      const authHeader = req.headers.authorization;

      if (authHeader?.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];

        try {
          const user = AuthService.decodeJWTToken(token);
          return { user };
        } catch {
          return {};
        }
      }

      return {};
    },
  });

  console.log(`Server ready at ${url}`);
}

bootstrap();
