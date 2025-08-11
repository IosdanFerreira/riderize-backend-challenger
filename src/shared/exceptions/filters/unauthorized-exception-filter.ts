import { GraphQLError } from "graphql";
import { IExceptionFilter } from "../interface/exception-filter.interface";
import { UnauthorizedError } from "../../errors/unauthorized.error";

export class UnauthorizedExceptionFilter implements IExceptionFilter {
  catch(error: UnauthorizedError): GraphQLError {
    return new GraphQLError("Acesso não autorizado", {
      extensions: {
        code: error.name,
        message: error.message,
        errors_details: null,
      },
    });
  }
}
