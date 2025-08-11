"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConflictError = void 0;
class ConflictError extends Error {
    constructor(errors) {
        super("Conflito entre os dados");
        this.name = "CONFLICT_ERROR";
        this.extensions = {
            errors_details: errors.map((error) => ({
                property: error.property,
                message: error.constraints
                    ? Object.values(error.constraints)[0]
                    : undefined,
            })),
        };
    }
}
exports.ConflictError = ConflictError;
