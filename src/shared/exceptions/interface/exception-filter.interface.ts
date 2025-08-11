import { GraphQLError } from "graphql";

export interface IExceptionFilter {
  catch(error: any): GraphQLError;
}
