"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationExceptionFilter = void 0;
const graphql_1 = require("graphql");
class ValidationExceptionFilter {
    catch(error) {
        return new graphql_1.GraphQLError("Erro de validação", {
            extensions: {
                code: error.extensions.code,
                message: "Erro na validação dos dados",
                errors_details: error.extensions.validationErrors.map((error) => ({
                    property: error.property,
                    message: error.constraints
                        ? error.constraints[Object.keys(error.constraints)[0]]
                        : undefined,
                })),
            },
        });
    }
}
exports.ValidationExceptionFilter = ValidationExceptionFilter;
