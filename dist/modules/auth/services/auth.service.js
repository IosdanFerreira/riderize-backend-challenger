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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const auth_repository_1 = require("../repositories/auth.repository");
const invalid_credentials_error_1 = require("../../../shared/errors/invalid-credentials.error");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const typedi_1 = require("typedi");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
/**
 * Serviço responsável pela autenticação e gerenciamento de usuários.
 */
let AuthService = class AuthService {
    constructor(authRepository) {
        this.authRepository = authRepository;
    }
    /**
     * Realiza o cadastro de um novo usuário.
     *
     * @param {CreateUserInput} dto - Dados para criação do usuário.
     * @returns {Promise<UserModel>} O usuário criado.
     */
    async signUp(dto) {
        const hashedPassword = await bcryptjs_1.default.hash(dto.password, 10);
        return await this.authRepository.create({
            ...dto,
            password: hashedPassword,
        });
    }
    /**
     * Realiza o login do usuário e retorna o token JWT.
     *
     * @param {LoginInput} dto - Dados de login (email e senha).
     * @throws {InvalidCredentialsError} Quando email ou senha são inválidos.
     * @returns {Promise<AuthModel>} Modelo de autenticação com token.
     */
    async login(dto) {
        const { email, password } = dto;
        const user = await this.authRepository.getByEmail(email);
        if (!user) {
            throw new invalid_credentials_error_1.InvalidCredentialsError("Email ou senha inválidos");
        }
        const correctPassword = await bcryptjs_1.default.compare(password, user.password);
        if (!correctPassword) {
            throw new invalid_credentials_error_1.InvalidCredentialsError("Email ou senha inválidos");
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            access_token: token,
        };
    }
    static decodeJWTToken(token) {
        return jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [auth_repository_1.AuthRepository])
], AuthService);
