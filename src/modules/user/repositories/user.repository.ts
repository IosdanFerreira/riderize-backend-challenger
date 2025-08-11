import { PrismaClient } from "@prisma/client";
import { Inject, Service } from "typedi";

@Service()
export class UserRepository {
  constructor(
    @Inject("prisma")
    private readonly prisma: PrismaClient
  ) {}

  async getById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true },
    });
  }
}
