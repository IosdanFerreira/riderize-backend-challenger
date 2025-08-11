import { ConflictError } from "../../errors/conflict.error";
import { GraphQLError } from "graphql";

export class ConflictExceptionFilter {
  catch(error: ConflictError): GraphQLError {
    return new GraphQLError("Erro de conflito", {
      extensions: {
        code: "CONFLICT_ERROR",
        message: "Conflito entre os dados",
        errors_details: error.extensions.errors_details,
      },
    });
  }
}
