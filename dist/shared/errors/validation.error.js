"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationError = void 0;
const graphql_1 = require("graphql");
class ValidationError extends graphql_1.GraphQLError {
    constructor(message, errors) {
        super(message, {
            extensions: {
                code: "VALIDATION_ERROR",
                message,
                errors_details: errors?.map((err) => ({
                    property: err.property,
                    message: err.message,
                })),
            },
        });
        this.name = "ValidationError";
    }
}
exports.ValidationError = ValidationError;
