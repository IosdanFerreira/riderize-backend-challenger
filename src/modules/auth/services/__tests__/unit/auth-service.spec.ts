import { AuthRepository } from "../../../repositories/auth.repository";
import { AuthService } from "../../auth.service";
import { InvalidCredentialsError } from "../../../../../shared/errors/invalid-credentials.error";
import JWT from "jsonwebtoken";
import bcrypt from "bcryptjs";

jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("AuthService", () => {
  let authService: AuthService;
  let authRepository: jest.Mocked<AuthRepository>;

  beforeEach(() => {
    authRepository = {
      create: jest.fn(),
      getByEmail: jest.fn(),
    } as any;

    authService = new AuthService(authRepository);

    jest.clearAllMocks();
  });

  describe("signUp", () => {
    it("deve criar usuário com senha hasheada", async () => {
      const dto = {
        name: "Fulano",
        email: "fulano@test.com",
        password: "123456",
      };
      const hashedPassword = "hashed_password";

      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      authRepository.create.mockResolvedValue({
        id: "user-1",
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      });

      const result = await authService.signUp(dto);

      expect(bcrypt.hash).toHaveBeenCalledWith(dto.password, 10);

      expect(authRepository.create).toHaveBeenCalledWith({
        ...dto,
        password: hashedPassword,
      });

      console.log(result);

      expect(result).toEqual({
        id: "user-1",
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        created_at: new Date(),
        updated_at: new Date(),
      });
    });
  });

  describe("login", () => {
    const dto = { email: "fulano@test.com", password: "123456" };
    const fakeUser = {
      id: "user-1",
      name: "Fulano",
      email: dto.email,
      password: "hashed_password",
      created_at: new Date(),
      updated_at: new Date(),
    };

    it("deve retornar token e dados do usuário quando credenciais corretas", async () => {
      authRepository.getByEmail.mockResolvedValue(fakeUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (JWT.sign as jest.Mock).mockReturnValue("fake_jwt_token");

      const result = await authService.login(dto);

      expect(authRepository.getByEmail).toHaveBeenCalledWith(dto.email);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        dto.password,
        fakeUser.password
      );
      expect(JWT.sign).toHaveBeenCalledWith(
        { id: fakeUser.id, email: fakeUser.email },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" }
      );

      expect(result).toEqual({
        id: fakeUser.id,
        name: fakeUser.name,
        email: fakeUser.email,
        access_token: "fake_jwt_token",
      });
    });

    it("deve lançar InvalidCredentialsError se email não existir", async () => {
      authRepository.getByEmail.mockResolvedValue(null);

      await expect(authService.login(dto)).rejects.toThrow(
        InvalidCredentialsError
      );
      expect(authRepository.getByEmail).toHaveBeenCalledWith(dto.email);
    });

    it("deve lançar InvalidCredentialsError se senha estiver incorreta", async () => {
      authRepository.getByEmail.mockResolvedValue(fakeUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(authService.login(dto)).rejects.toThrow(
        InvalidCredentialsError
      );
      expect(bcrypt.compare).toHaveBeenCalledWith(
        dto.password,
        fakeUser.password
      );
    });
  });

  describe("decodeJWTToken", () => {
    it("deve chamar JWT.verify com o token e secret", () => {
      const token = "token123";
      (JWT.verify as jest.Mock).mockReturnValue({ id: "user-1" });

      const result = AuthService.decodeJWTToken(token);

      expect(JWT.verify).toHaveBeenCalledWith(token, process.env.JWT_SECRET!);
      expect(result).toEqual({ id: "user-1" });
    });
  });
});
