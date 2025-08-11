import { GraphQLError } from "graphql";
import { IExceptionFilter } from "../interface/exception-filter.interface";
import { InvalidCredentialsError } from "../../errors/invalid-credentials.error";

export class InvalidCredentialsExceptionFilter implements IExceptionFilter {
  catch(error: InvalidCredentialsError): GraphQLError {
    return new GraphQLError("Credenciais inválidas", {
      extensions: {
        code: error.name,
        message: error.message,
        errors_details: null,
      },
    });
  }
}
