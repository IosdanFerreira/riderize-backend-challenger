import "reflect-metadata";

import { UserModel } from "../../../model/user.model";
import { UserResolver } from "../../user.resolver";
import { UserService } from "../../../service/user.service";

describe("UserResolver unit tests", () => {
  let userResolver: UserResolver;
  let userServiceMock: jest.Mocked<UserService>;

  beforeEach(() => {
    userServiceMock = {
      getUserById: jest.fn(),
    } as any;

    userResolver = new UserResolver(userServiceMock);
    jest.clearAllMocks();
  });

  describe("getUserById", () => {
    it("deve retornar o usuário quando encontrado", async () => {
      const fakeUser: UserModel = {
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

      await expect(userResolver.getUserById("user-1")).rejects.toThrow(
        "Usuário não encontrado"
      );
    });
  });
});
