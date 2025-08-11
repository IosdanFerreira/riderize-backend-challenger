"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const auth_resolver_1 = require("../../auth.resolver");
const auth_service_1 = require("../../../services/auth.service");
jest.mock("../../../services/auth.service");
describe("AuthResolver", () => {
    let authService;
    let authResolver;
    let authRepository;
    beforeEach(() => {
        authRepository = {
            create: jest.fn(),
            getByEmail: jest.fn(),
        };
        authService = new auth_service_1.AuthService(authRepository);
        authResolver = new auth_resolver_1.AuthResolver(authService);
        jest.clearAllMocks();
    });
    describe("signup", () => {
        it("deve chamar authService.signUp e retornar usuário criado", async () => {
            const input = {
                name: "Fulano",
                email: "fulano@test.com",
                password: "123456",
            };
            const fakeUser = {
                id: "user-1",
                name: input.name,
                email: input.email,
            };
            authService.signUp.mockResolvedValue(fakeUser);
            const result = await authResolver.signup(input);
            expect(authService.signUp).toHaveBeenCalledWith(input);
            expect(result).toEqual(fakeUser);
        });
    });
    describe("login", () => {
        it("deve chamar authService.login e retornar token e dados do usuário", async () => {
            const input = {
                email: "fulano@test.com",
                password: "123456",
            };
            const fakeAuth = {
                id: "user-1",
                name: "Fulano",
                email: input.email,
                access_token: "fake_jwt_token",
            };
            authService.login.mockResolvedValue(fakeAuth);
            const result = await authResolver.login(input);
            expect(authService.login).toHaveBeenCalledWith(input);
            expect(result).toEqual(fakeAuth);
        });
    });
});
