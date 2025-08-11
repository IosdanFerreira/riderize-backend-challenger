"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatGraphQLError = formatGraphQLError;
function formatGraphQLError(error) {
    const isValidationError = error.originalError?.name === "ValidationError";
    // Exemplo de estrutura para erros de validação
    const errorsDetails = isValidationError
        ? error.originalError?.details?.map((err) => ({
            property: err.path?.join(".") || "unknown",
            message: err.message,
        })) || []
        : [];
    const code = error.extensions?.code || "INTERNAL_SERVER_ERROR";
    return {
        message: error.message || "Erro interno",
        locations: error.locations,
        path: error.path,
        extensions: {
            code,
            message: error.message,
            errors_details: errorsDetails.length > 0 ? errorsDetails : undefined,
        },
    };
}
