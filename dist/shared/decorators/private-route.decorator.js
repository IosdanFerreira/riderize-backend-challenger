"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsPrivate = void 0;
const unauthorized_error_1 = require("../errors/unauthorized.error");
const IsPrivate = async ({ context }, next) => {
    if (!context.user) {
        throw new unauthorized_error_1.UnauthorizedError("Acesso não autorizado");
    }
    return next();
};
exports.IsPrivate = IsPrivate;
