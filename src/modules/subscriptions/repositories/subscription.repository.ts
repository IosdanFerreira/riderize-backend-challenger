import { PrismaClient } from "@prisma/client";
import { Inject, Service } from "typedi";
import { SubscribeToRideInput } from "../../ride/dto/subscribe-to-ride.input.dto";

@Service()
export class SubscriptionRepository {
  constructor(
    @Inject("prisma")
    private readonly prisma: PrismaClient
  ) {}

  /**
   * Busca a primeira inscrição encontrada para um usuário em um pedal específico.
   *
   * @param ride_id - ID do pedal (ride).
   * @param user_id - ID do usuário inscrito.
   * @returns Promessa com a inscrição encontrada ou `null` caso não exista.
   */
  async findFirst(ride_id: string, user_id: string) {
    return await this.prisma.rideSubscription.findFirst({
      where: { ride_id: ride_id, user_id: user_id },
      include: { ride: true, user: true },
    });
  }

  /**
   * Cria uma nova inscrição de um usuário em um pedal.
   *
   * @param data - Dados da inscrição, incluindo o ID do pedal (`ride_id`).
   * @param user_id - ID do usuário que está se inscrevendo.
   * @returns Promessa com a inscrição criada, incluindo dados do pedal e do usuário.
   */
  async create(data: SubscribeToRideInput, user_id: string) {
    return await this.prisma.rideSubscription.create({
      data: {
        user_id,
        ...data,
        subscription_date: new Date(),
      },
      include: {
        ride: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  /**
   * Lista todas as inscrições realizadas por um usuário.
   *
   * @param user_id - ID do usuário.
   * @returns Promessa com a lista de inscrições, incluindo dados do pedal e do usuário.
   */
  async findManyByUserId(user_id: string) {
    return await this.prisma.rideSubscription.findMany({
      where: { user_id },
      include: { ride: true, user: true },
    });
  }

  /**
   * Remove a inscrição de um usuário em um pedal específico.
   *
   * @param ride_id - ID do pedal.
   * @param user_id - ID do usuário.
   * @returns Promessa com o resultado da exclusão (quantidade de registros deletados).
   */
  async delete(ride_id: string, user_id: string) {
    return this.prisma.rideSubscription.deleteMany({
      where: {
        ride_id,
        user_id,
      },
    });
  }
}
