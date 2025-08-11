"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidCredentialsError = void 0;
class InvalidCredentialsError extends Error {
    constructor(message) {
        super(message);
        this.name = "INVALID_CREDENTIALS_ERROR";
        this.invalidCredentialsErrors = [{ message }];
    }
}
exports.InvalidCredentialsError = InvalidCredentialsError;
