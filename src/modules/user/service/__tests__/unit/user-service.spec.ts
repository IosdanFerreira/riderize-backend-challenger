import { NotFoundError } from "../../../../../shared/errors/not-found.error";
import { UserModel } from "../../../model/user.model";
import { UserRepository } from "../../../repositories/user.repository";
import { UserService } from "../../user.service";

describe("UserService unit tests", () => {
  let userService: UserService;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    userRepository = {
      getById: jest.fn(),
    } as unknown as jest.Mocked<UserRepository>;

    userService = new UserService(userRepository);
  });

  describe("getUserById", () => {
    it("deve retornar o usuário quando encontrado", async () => {
      const fakeUser: UserModel = {
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

      await expect(userService.getUserById("999")).rejects.toThrow(
        NotFoundError
      );
      await expect(userService.getUserById("999")).rejects.toThrow(
        "Usuário não encontrado"
      );

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

    userRepository.getById.mockResolvedValue(fakeRepoUser as any);

    const result = await userService.getUserById("123");

    expect(result).toEqual({
      id: "123",
      name: "Fulano",
      email: "fulano@example.com",
    });
  });
});
