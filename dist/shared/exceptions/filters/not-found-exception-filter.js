"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundExceptionFilter = void 0;
const graphql_1 = require("graphql");
class NotFoundExceptionFilter {
    catch(error) {
        return new graphql_1.GraphQLError("Dados não encontrados", {
            extensions: {
                code: error.name,
                message: error.message,
                errors_details: null,
            },
        });
    }
}
exports.NotFoundExceptionFilter = NotFoundExceptionFilter;
