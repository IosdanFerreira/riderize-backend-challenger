// src/graphql/format-error.ts
import { GraphQLError } from "graphql";

export function formatGraphQLError(error: GraphQLError) {
  const isValidationError = error.originalError?.name === "ValidationError";

  // Exemplo de estrutura para erros de validação
  const errorsDetails = isValidationError
    ? (error.originalError as any)?.details?.map((err: any) => ({
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
