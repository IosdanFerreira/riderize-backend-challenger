"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundError = void 0;
class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = "NOT_FOUND_ERROR";
        this.notFoundErrors = [{ message }];
    }
}
exports.NotFoundError = NotFoundError;
