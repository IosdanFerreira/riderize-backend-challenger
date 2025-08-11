import { AuthModel } from "../model/auth.model";
import { AuthRepository } from "../repositories/auth.repository";
import { CreateUserInput } from "../dto/create-user.input.dto";
import { InvalidCredentialsError } from "../../../shared/errors/invalid-credentials.error";
import JWT from "jsonwebtoken";
import { LoginInput } from "../dto/login.input.dto";
import { Service } from "typedi";
import { UserModel } from "../../user/model/user.model";
import bcrypt from "bcryptjs";

/**
 * Serviço responsável pela autenticação e gerenciamento de usuários.
 */
@Service()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  /**
   * Realiza o cadastro de um novo usuário.
   *
   * @param {CreateUserInput} dto - Dados para criação do usuário.
   * @returns {Promise<UserModel>} O usuário criado.
   */
  async signUp(dto: CreateUserInput): Promise<UserModel> {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

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
  async login(dto: LoginInput): Promise<AuthModel> {
    const { email, password } = dto;

    const user = await this.authRepository.getByEmail(email);

    if (!user) {
      throw new InvalidCredentialsError("Email ou senha inválidos");
    }

    const correctPassword = await bcrypt.compare(password, user.password);

    if (!correctPassword) {
      throw new InvalidCredentialsError("Email ou senha inválidos");
    }

    const token = JWT.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      access_token: token,
    };
  }

  public static decodeJWTToken(token: string) {
    return JWT.verify(token, process.env.JWT_SECRET!);
  }
}
