import { GraphQLError } from "graphql";
import { IExceptionFilter } from "../interface/exception-filter.interface";
import { NotFoundError } from "../../errors/not-found.error";

export class NotFoundExceptionFilter implements IExceptionFilter {
  catch(error: NotFoundError): GraphQLError {
    return new GraphQLError("Dados não encontrados", {
      extensions: {
        code: error.name,
        message: error.message,
        errors_details: null,
      },
    });
  }
}
