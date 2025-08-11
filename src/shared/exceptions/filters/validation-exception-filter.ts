import { ArgumentValidationError } from "type-graphql";
import { GraphQLError } from "graphql";
import { IExceptionFilter } from "../interface/exception-filter.interface";

export class ValidationExceptionFilter implements IExceptionFilter {
  catch(error: ArgumentValidationError): GraphQLError {
    return new GraphQLError("Erro de validação", {
      extensions: {
        code: error.extensions.code,
        message: "Erro na validação dos dados",
        errors_details: error.extensions.validationErrors.map((error) => ({
          property: error.property,
          message: error.constraints
            ? error.constraints[Object.keys(error.constraints)[0]]
            : undefined,
        })),
      },
    });
  }
}
