import { PrismaClient } from "@prisma/client";
import { Inject, Service } from "typedi";
import { CreateUserInput } from "../dto/create-user.input.dto";

/**
 * Repositório para operações relacionadas à autenticação e usuários.
 */
@Service()
export class AuthRepository {
  constructor(
    @Inject("prisma")
    private readonly prisma: PrismaClient
  ) {}

  /**
   * Cria um novo usuário no banco de dados.
   *
   * @param {CreateUserInput} dto - Dados para criação do usuário.
   * @returns {Promise<import("@prisma/client").User>} O usuário criado.
   */
  async create(dto: CreateUserInput) {
    return this.prisma.user.create({ data: dto });
  }

  /**
   * Busca um usuário pelo email.
   *
   * @param {string} email - Email do usuário a ser buscado.
   * @returns {Promise<import("@prisma/client").User | null>} O usuário encontrado ou null caso não exista.
   */
  async getByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }
}
