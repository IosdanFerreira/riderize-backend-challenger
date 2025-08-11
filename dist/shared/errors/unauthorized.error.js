"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthorizedError = void 0;
class UnauthorizedError extends Error {
    constructor(message) {
        super(message);
        this.unauthorizedErrors = [{ message }];
        this.name = "UNAUTHORIZED_ERROR";
    }
}
exports.UnauthorizedError = UnauthorizedError;
