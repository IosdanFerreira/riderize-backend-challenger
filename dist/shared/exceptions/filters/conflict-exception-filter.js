"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConflictExceptionFilter = void 0;
const graphql_1 = require("graphql");
class ConflictExceptionFilter {
    catch(error) {
        return new graphql_1.GraphQLError("Erro de conflito", {
            extensions: {
                code: "CONFLICT_ERROR",
                message: "Conflito entre os dados",
                errors_details: error.extensions.errors_details,
            },
        });
    }
}
exports.ConflictExceptionFilter = ConflictExceptionFilter;
