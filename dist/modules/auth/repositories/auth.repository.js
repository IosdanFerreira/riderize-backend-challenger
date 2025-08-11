"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRepository = void 0;
const client_1 = require("@prisma/client");
const typedi_1 = require("typedi");
/**
 * Repositório para operações relacionadas à autenticação e usuários.
 */
let AuthRepository = class AuthRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    /**
     * Cria um novo usuário no banco de dados.
     *
     * @param {CreateUserInput} dto - Dados para criação do usuário.
     * @returns {Promise<import("@prisma/client").User>} O usuário criado.
     */
    async create(dto) {
        return this.prisma.user.create({ data: dto });
    }
    /**
     * Busca um usuário pelo email.
     *
     * @param {string} email - Email do usuário a ser buscado.
     * @returns {Promise<import("@prisma/client").User | null>} O usuário encontrado ou null caso não exista.
     */
    async getByEmail(email) {
        return this.prisma.user.findUnique({ where: { email } });
    }
};
exports.AuthRepository = AuthRepository;
exports.AuthRepository = AuthRepository = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typedi_1.Inject)("prisma")),
    __metadata("design:paramtypes", [client_1.PrismaClient])
], AuthRepository);
