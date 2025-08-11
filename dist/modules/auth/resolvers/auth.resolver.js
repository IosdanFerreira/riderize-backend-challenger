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
exports.AuthResolver = void 0;
const type_graphql_1 = require("type-graphql");
const typedi_1 = require("typedi");
const auth_model_1 = require("../model/auth.model");
const auth_service_1 = require("../services/auth.service");
const create_user_input_dto_1 = require("../dto/create-user.input.dto");
const user_model_1 = require("../../user/model/user.model");
const login_input_dto_1 = require("../dto/login.input.dto");
let AuthResolver = class AuthResolver {
    constructor(authService) {
        this.authService = authService;
    }
    /**
     * Registra um novo usuário no sistema.
     *
     * @param input - Dados necessários para criação do usuário.
     * @returns Promessa contendo o usuário criado.
     */
    async signup(input) {
        return this.authService.signUp(input);
    }
    /**
     * Realiza login de um usuário com email e senha, retornando token JWT e dados básicos.
     *
     * @param input - Credenciais de acesso (email e senha).
     * @returns Promessa contendo o token JWT e dados do usuário autenticado.
     */
    async login(input) {
        return this.authService.login(input);
    }
};
exports.AuthResolver = AuthResolver;
__decorate([
    (0, type_graphql_1.Mutation)(() => user_model_1.UserModel),
    __param(0, (0, type_graphql_1.Arg)("input")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_input_dto_1.CreateUserInput]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "signup", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => auth_model_1.AuthModel),
    __param(0, (0, type_graphql_1.Arg)("input")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_input_dto_1.LoginInput]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "login", null);
exports.AuthResolver = AuthResolver = __decorate([
    (0, typedi_1.Service)(),
    (0, type_graphql_1.Resolver)(() => auth_model_1.AuthModel),
    __param(0, (0, typedi_1.Inject)(() => auth_service_1.AuthService)),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthResolver);
