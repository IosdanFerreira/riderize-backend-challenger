"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleDatabaseErrors = void 0;
const conflict_error_1 = require("../errors/conflict.error");
const graphql_1 = require("graphql");
var PrismaErrors;
(function (PrismaErrors) {
    PrismaErrors["UniqueConstraintFail"] = "P2002";
})(PrismaErrors || (PrismaErrors = {}));
const handleDatabaseErrors = (e) => {
    if (e.code === PrismaErrors.UniqueConstraintFail) {
        const target = Array.isArray(e.meta?.target) ? e.meta.target[0] : e.meta?.target ?? "unknown";
        return new conflict_error_1.ConflictError([
            {
                property: target,
                constraints: {
                    unique: `O valor fornecido para ${target} já está em uso`,
                },
            },
        ]);
    }
    return new graphql_1.GraphQLError("Erro desconhecido no banco de dados.");
};
exports.handleDatabaseErrors = handleDatabaseErrors;
