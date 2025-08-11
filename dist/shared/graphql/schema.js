"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSchema = createSchema;
const auth_resolver_1 = require("../../modules/auth/resolvers/auth.resolver");
const typedi_1 = require("typedi");
const exception_handling_middleware_1 = require("../middleware/exception-handling.middleware");
const ride_resolver_1 = require("../../modules/ride/resolvers/ride.resolver");
const subscription_resolver_1 = require("../../modules/subscriptions/resolvers/subscription.resolver");
const user_resolver_1 = require("../../modules/user/resolvers/user.resolver");
const type_graphql_1 = require("type-graphql");
async function createSchema() {
    return await (0, type_graphql_1.buildSchema)({
        resolvers: [user_resolver_1.UserResolver, auth_resolver_1.AuthResolver, ride_resolver_1.RideResolver, subscription_resolver_1.SubscriptionResolver],
        container: typedi_1.Container,
        globalMiddlewares: [exception_handling_middleware_1.ExceptionHandlingMiddleware],
        validate: true,
    });
}
