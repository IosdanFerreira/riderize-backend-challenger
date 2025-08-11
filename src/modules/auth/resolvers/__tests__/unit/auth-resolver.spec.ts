import "reflect-metadata";

import { AuthModel } from "../../../model/auth.model";
import { AuthRepository } from "../../../repositories/auth.repository";
import { AuthResolver } from "../../auth.resolver";
import { AuthService } from "../../../services/auth.service";
import { CreateUserInput } from "../../../dto/create-user.input.dto";
import { LoginInput } from "../../../dto/login.input.dto";
import { UserModel } from "../../../../user/model/user.model";

jest.mock("../../../services/auth.service");

describe("AuthResolver", () => {
  let authService: jest.Mocked<AuthService>;
  let authResolver: AuthResolver;
  let authRepository: jest.Mocked<AuthRepository>;

  beforeEach(() => {
    authRepository = {
      create: jest.fn(),
      getByEmail: jest.fn(),
    } as any;

    authService = new AuthService(authRepository) as jest.Mocked<AuthService>;
    authResolver = new AuthResolver(authService);
    jest.clearAllMocks();
  });

  describe("signup", () => {
    it("deve chamar authService.signUp e retornar usuário criado", async () => {
      const input: CreateUserInput = {
        name: "Fulano",
        email: "fulano@test.com",
        password: "123456",
      };

      const fakeUser: UserModel = {
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
      const input: LoginInput = {
        email: "fulano@test.com",
        password: "123456",
      };

      const fakeAuth: AuthModel = {
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
