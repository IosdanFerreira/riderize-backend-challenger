"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const not_found_error_1 = require("../../../../../shared/errors/not-found.error");
const user_service_1 = require("../../user.service");
describe("UserService unit tests", () => {
    let userService;
    let userRepository;
    beforeEach(() => {
        userRepository = {
            getById: jest.fn(),
        };
        userService = new user_service_1.UserService(userRepository);
    });
    describe("getUserById", () => {
        it("deve retornar o usuário quando encontrado", async () => {
            const fakeUser = {
                id: "123",
                name: "Fulano",
                email: "fulano@example.com",
            };
            userRepository.getById.mockResolvedValue(fakeUser);
            const result = await userService.getUserById("123");
            expect(userRepository.getById).toHaveBeenCalledWith("123");
            expect(result).toEqual(fakeUser);
        });
        it("deve lançar NotFoundError quando usuário não for encontrado", async () => {
            userRepository.getById.mockResolvedValue(null);
            await expect(userService.getUserById("999")).rejects.toThrow(not_found_error_1.NotFoundError);
            await expect(userService.getUserById("999")).rejects.toThrow("Usuário não encontrado");
            expect(userRepository.getById).toHaveBeenCalledTimes(2);
        });
    });
    it("deve retornar apenas os campos de UserModel", async () => {
        const fakeRepoUser = {
            id: "123",
            name: "Fulano",
            email: "fulano@example.com",
            password: "123456",
            created_at: new Date(),
            updated_at: new Date(),
        };
        userRepository.getById.mockResolvedValue(fakeRepoUser);
        const result = await userService.getUserById("123");
        expect(result).toEqual({
            id: "123",
            name: "Fulano",
            email: "fulano@example.com",
        });
    });
});
