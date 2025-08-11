"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExceptionFilterManager = void 0;
const type_graphql_1 = require("type-graphql");
const conflict_error_1 = require("../errors/conflict.error");
const conflict_exception_filter_1 = require("./filters/conflict-exception-filter");
const graphql_1 = require("graphql");
const invalid_credentials_error_1 = require("../errors/invalid-credentials.error");
const invalid_credentials_exception_filter_1 = require("./filters/invalid-credentials-exception-filter");
const not_found_error_1 = require("../errors/not-found.error");
const not_found_exception_filter_1 = require("./filters/not-found-exception-filter");
const library_1 = require("@prisma/client/runtime/library");
const unauthorized_error_1 = require("../errors/unauthorized.error");
const unauthorized_exception_filter_1 = require("./filters/unauthorized-exception-filter");
const validation_error_1 = require("../errors/validation.error");
const validation_exception_filter_1 = require("./filters/validation-exception-filter");
const handle_database_error_utils_1 = require("../utils/handle-database-error.utils");
class ExceptionFilterManager {
    static catch(error) {
        // Erro de validação
        if (error instanceof type_graphql_1.ArgumentValidationError) {
            return new validation_exception_filter_1.ValidationExceptionFilter().catch(error);
        }
        if (error instanceof validation_error_1.ValidationError) {
        }
        // Erros de banco de dados - PRISMA
        if (error instanceof library_1.PrismaClientKnownRequestError) {
            const handledError = (0, handle_database_error_utils_1.handleDatabaseErrors)(error);
            if (handledError instanceof conflict_error_1.ConflictError) {
                return new conflict_exception_filter_1.ConflictExceptionFilter().catch(handledError);
            }
            return new graphql_1.GraphQLError(handledError.message || "Erro no banco de dados", {
                extensions: { code: "INTERNAL_SERVER_ERROR" },
            });
        }
        // Dados não encontrados
        if (error instanceof not_found_error_1.NotFoundError) {
            return new not_found_exception_filter_1.NotFoundExceptionFilter().catch(error);
        }
        // Acesso não autorizado
        if (error instanceof unauthorized_error_1.UnauthorizedError) {
            return new unauthorized_exception_filter_1.UnauthorizedExceptionFilter().catch(error);
        }
        // Credenciais inválidas
        if (error instanceof invalid_credentials_error_1.InvalidCredentialsError) {
            return new invalid_credentials_exception_filter_1.InvalidCredentialsExceptionFilter().catch(error);
        }
        // Outros erros genéricos
        return new graphql_1.GraphQLError(error.message || "Internal server error", {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
    }
}
exports.ExceptionFilterManager = ExceptionFilterManager;
