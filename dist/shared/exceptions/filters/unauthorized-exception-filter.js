"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthorizedExceptionFilter = void 0;
const graphql_1 = require("graphql");
class UnauthorizedExceptionFilter {
    catch(error) {
        return new graphql_1.GraphQLError("Acesso não autorizado", {
            extensions: {
                code: error.name,
                message: error.message,
                errors_details: null,
            },
        });
    }
}
exports.UnauthorizedExceptionFilter = UnauthorizedExceptionFilter;
