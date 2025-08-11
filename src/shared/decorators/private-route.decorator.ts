import { MiddlewareFn } from "type-graphql";
import { UnauthorizedError } from "../errors/unauthorized.error";

export const IsPrivate: MiddlewareFn<any> = async ({ context }, next) => {
  if (!context.user) {
    throw new UnauthorizedError("Acesso não autorizado");
  }

  return next();
};
