import { Resolver, Mutation, Arg } from "type-graphql";
import { Inject, Service } from "typedi";
import { AuthModel } from "../model/auth.model";
import { AuthService } from "../services/auth.service";
import { CreateUserInput } from "../dto/create-user.input.dto";
import { UserModel } from "../../user/model/user.model";
import { LoginInput } from "../dto/login.input.dto";

@Service()
@Resolver(() => AuthModel)
export class AuthResolver {
  constructor(
    @Inject(() => AuthService)
    private readonly authService: AuthService
  ) {}

  /**
   * Registra um novo usuário no sistema.
   *
   * @param input - Dados necessários para criação do usuário.
   * @returns Promessa contendo o usuário criado.
   */
  @Mutation(() => UserModel)
  async signup(@Arg("input") input: CreateUserInput) {
    return this.authService.signUp(input);
  }

  /**
   * Realiza login de um usuário com email e senha, retornando token JWT e dados básicos.
   *
   * @param input - Credenciais de acesso (email e senha).
   * @returns Promessa contendo o token JWT e dados do usuário autenticado.
   */
  @Mutation(() => AuthModel)
  async login(@Arg("input") input: LoginInput) {
    return this.authService.login(input);
  }
}
