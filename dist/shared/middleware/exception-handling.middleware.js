"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExceptionHandlingMiddleware = void 0;
const exception_filter_manager_1 = require("../exceptions/exception-filter-manager");
const ExceptionHandlingMiddleware = async ({}, next) => {
    try {
        return await next();
    }
    catch (error) {
        throw exception_filter_manager_1.ExceptionFilterManager.catch(error);
    }
};
exports.ExceptionHandlingMiddleware = ExceptionHandlingMiddleware;
