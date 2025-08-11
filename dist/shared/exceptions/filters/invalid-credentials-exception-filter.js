"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidCredentialsExceptionFilter = void 0;
const graphql_1 = require("graphql");
class InvalidCredentialsExceptionFilter {
    catch(error) {
        return new graphql_1.GraphQLError("Credenciais inválidas", {
            extensions: {
                code: error.name,
                message: error.message,
                errors_details: null,
            },
        });
    }
}
exports.InvalidCredentialsExceptionFilter = InvalidCredentialsExceptionFilter;
