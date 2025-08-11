import { AuthResolver } from "../../modules/auth/resolvers/auth.resolver";
import { Container } from "typedi";
import { ExceptionHandlingMiddleware } from "../middleware/exception-handling.middleware";
import { RideResolver } from "../../modules/ride/resolvers/ride.resolver";
import { SubscriptionResolver } from "../../modules/subscriptions/resolvers/subscription.resolver";
import { UserResolver } from "../../modules/user/resolvers/user.resolver";
import { buildSchema } from "type-graphql";

export async function createSchema() {
  return await buildSchema({
    resolvers: [UserResolver, AuthResolver, RideResolver, SubscriptionResolver],
    container: Container,
    globalMiddlewares: [ExceptionHandlingMiddleware],
    validate: true,
  });
}
