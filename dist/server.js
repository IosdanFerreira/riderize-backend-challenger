"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const server_1 = require("@apollo/server");
const auth_service_1 = require("./modules/auth/services/auth.service");
const typedi_1 = __importDefault(require("typedi"));
const schema_1 = require("./shared/graphql/schema");
const prisma_client_1 = require("./shared/lib/prisma/prisma-client");
const redis_client_1 = require("./shared/redis/redis.client");
const standalone_1 = require("@apollo/server/standalone");
async function bootstrap() {
    typedi_1.default.set("prisma", prisma_client_1.prismaClient);
    typedi_1.default.set("redisClient", redis_client_1.redisClient);
    const schema = await (0, schema_1.createSchema)();
    const server = new server_1.ApolloServer({
        schema,
        introspection: true,
        formatError: (formattedError) => {
            const { extensions, ...rest } = formattedError;
            const cleanExtensions = { ...extensions };
            if (cleanExtensions?.stacktrace) {
                delete cleanExtensions.stacktrace;
            }
            if (formattedError.message.includes("got invalid value") ||
                formattedError.message.includes("cannot represent a non") ||
                formattedError.message.includes("must not be null")) {
                const match = formattedError.message.match(/\$(\w+)/);
                const field = match ? match[1] : "desconhecido";
                const fieldName = field.split(".").pop();
                // Para mensagens "cannot represent a non"
                const typeMatch1 = formattedError.message.match(/;\s*(\w+)\s+cannot represent a non/);
                // Para mensagens "must not be null", extrai o tipo dentro das aspas e retira o "!"
                const typeMatch2 = formattedError.message.match(/of non-null type "(\w+)!"/);
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
    const { url } = await (0, standalone_1.startStandaloneServer)(server, {
        listen: { port: Number(process.env.PORT) },
        context: async ({ req }) => {
            const authHeader = req.headers.authorization;
            if (authHeader?.startsWith("Bearer ")) {
                const token = authHeader.split(" ")[1];
                try {
                    const user = auth_service_1.AuthService.decodeJWTToken(token);
                    return { user };
                }
                catch {
                    return {};
                }
            }
            return {};
        },
    });
    console.log("DATABASE_URL:", process.env.DATABASE_URL);
    console.log(`Server ready at ${url}`);
}
bootstrap();
