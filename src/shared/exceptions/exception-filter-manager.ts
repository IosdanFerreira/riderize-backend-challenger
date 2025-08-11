import { ArgumentValidationError } from "type-graphql";
import { ConflictError } from "../errors/conflict.error";
import { ConflictExceptionFilter } from "./filters/conflict-exception-filter";
import { GraphQLError } from "graphql";
import { InvalidCredentialsError } from "../errors/invalid-credentials.error";
import { InvalidCredentialsExceptionFilter } from "./filters/invalid-credentials-exception-filter";
import { NotFoundError } from "../errors/not-found.error";
import { NotFoundExceptionFilter } from "./filters/not-found-exception-filter";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { UnauthorizedError } from "../errors/unauthorized.error";
import { UnauthorizedExceptionFilter } from "./filters/unauthorized-exception-filter";
import { ValidationError } from "../errors/validation.error";
import { ValidationExceptionFilter } from "./filters/validation-exception-filter";
import { handleDatabaseErrors } from "../utils/handle-database-error.utils";

export class ExceptionFilterManager {
  static catch(error: any): GraphQLError {
    // Erro de validação
    if (error instanceof ArgumentValidationError) {
      return new ValidationExceptionFilter().catch(error);
    }

    if (error instanceof ValidationError) {
    }

    // Erros de banco de dados - PRISMA
    if (error instanceof PrismaClientKnownRequestError) {
      const handledError = handleDatabaseErrors(error as any);

      if (handledError instanceof ConflictError) {
        return new ConflictExceptionFilter().catch(handledError);
      }

      return new GraphQLError(
        handledError.message || "Erro no banco de dados",
        {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        }
      );
    }

    // Dados não encontrados
    if (error instanceof NotFoundError) {
      return new NotFoundExceptionFilter().catch(error);
    }

    // Acesso não autorizado
    if (error instanceof UnauthorizedError) {
      return new UnauthorizedExceptionFilter().catch(error);
    }

    // Credenciais inválidas
    if (error instanceof InvalidCredentialsError) {
      return new InvalidCredentialsExceptionFilter().catch(error);
    }

    // Outros erros genéricos
    return new GraphQLError(error.message || "Internal server error", {
      extensions: { code: "INTERNAL_SERVER_ERROR" },
    });
  }
}
