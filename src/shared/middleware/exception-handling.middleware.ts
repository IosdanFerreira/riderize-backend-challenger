import { ExceptionFilterManager } from "../exceptions/exception-filter-manager";
import { MiddlewareFn } from "type-graphql";

export const ExceptionHandlingMiddleware: MiddlewareFn<any> = async ({}, next) => {
  try {
    return await next();
  } catch (error) {
    throw ExceptionFilterManager.catch(error);
  }
};
