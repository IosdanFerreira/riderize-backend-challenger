"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const user_resolver_1 = require("../../user.resolver");
describe("UserResolver unit tests", () => {
    let userResolver;
    let userServiceMock;
    beforeEach(() => {
        userServiceMock = {
            getUserById: jest.fn(),
        };
        userResolver = new user_resolver_1.UserResolver(userServiceMock);
        jest.clearAllMocks();
    });
    describe("getUserById", () => {
        it("deve retornar o usuário quando encontrado", async () => {
            const fakeUser = {
                id: "user-1",
                name: "Fulano",
                email: "fulano@example.com",
            };
            userServiceMock.getUserById.mockResolvedValue(fakeUser);
            const result = await userResolver.getUserById("user-1");
            expect(userServiceMock.getUserById).toHaveBeenCalledWith("user-1");
            expect(result).toEqual(fakeUser);
        });
        it("deve propagar erros lançados pelo serviço", async () => {
            const error = new Error("Usuário não encontrado");
            userServiceMock.getUserById.mockRejectedValue(error);
            await expect(userResolver.getUserById("user-1")).rejects.toThrow("Usuário não encontrado");
        });
    });
});
