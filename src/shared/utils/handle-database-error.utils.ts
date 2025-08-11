import { ConflictError } from "../errors/conflict.error";
import { GraphQLError } from "graphql";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

enum PrismaErrors {
  UniqueConstraintFail = "P2002",
}

export const handleDatabaseErrors = (e: PrismaClientKnownRequestError): Error => {
  if (e.code === PrismaErrors.UniqueConstraintFail) {
    const target = Array.isArray(e.meta?.target) ? e.meta.target[0] : e.meta?.target ?? "unknown";

    return new ConflictError([
      {
        property: target,
        constraints: {
          unique: `O valor fornecido para ${target} já está em uso`,
        },
      },
    ]);
  }

  return new GraphQLError("Erro desconhecido no banco de dados.");
};
