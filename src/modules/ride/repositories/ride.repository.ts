import { CreateRideInput } from "../dto/create-ride.input.dto";
import { PrismaClient } from "@prisma/client";
import { Inject, Service } from "typedi";
import { UpdateRideInput } from "../dto/update-ride.input.dto";
import { CountedRides } from "../models/counted-rides.model";
import { RideModel } from "../models/ride.model";

@Service()
export class RideRepository {
  constructor(
    @Inject("prisma")
    private readonly prisma: PrismaClient
  ) {}

  /**
   * Cria um novo pedal (ride) associado a um usuário criador.
   *
   * @param data - Dados para criação do pedal.
   * @param creator_id - ID do usuário que está criando o pedal.
   * @returns Promessa contendo o pedal criado com informações do criador e inscrições.
   */
  async create(data: CreateRideInput, creator_id: string): Promise<RideModel> {
    return await this.prisma.ride.create({
      data: { ...data, creator_id },
      include: {
        subscriptions: {
          include: {
            user: true,
            ride: {
              include: { creator: true },
            },
          },
        },
        creator: true,
      },
    });
  }

  /**
   * Busca um pedal pelo seu ID.
   *
   * @param id - ID do pedal.
   * @returns Promessa com o pedal encontrado ou `null` se não existir.
   */
  async findById(id: string): Promise<RideModel | null> {
    return await this.prisma.ride.findUnique({
      where: { id },
      include: {
        subscriptions: {
          include: {
            user: true,
            ride: {
              include: { creator: true },
            },
          },
        },
        creator: true,
      },
    });
  }

  /**
   * Lista todos os pedais criados por um usuário específico.
   *
   * @param user_id - ID do criador.
   * @returns Lista de pedais com inscrições e criador.
   */
  async findManyByCreatorId(user_id: string): Promise<RideModel[]> {
    return this.prisma.ride.findMany({
      where: { creator_id: user_id },
      orderBy: { created_at: "desc" },
      include: {
        subscriptions: {
          include: {
            user: true,
            ride: {
              include: { creator: true },
            },
          },
        },
        creator: true,
      },
    });
  }

  /**
   * Lista todos os pedais com paginação e retorna também a contagem total.
   *
   * @param page - Número da página.
   * @param limit - Quantidade de registros por página.
   * @returns Objeto contendo a lista de pedais e o total de registros.
   */
  async findAllWithCount(page: number, limit: number): Promise<CountedRides> {
    const skip = (Number(page) - 1) * Number(limit);

    const [rides, total] = await this.prisma.$transaction([
      this.prisma.ride.findMany({
        skip,
        take: Number(limit),
        orderBy: { created_at: "desc" },
        include: {
          subscriptions: {
            include: {
              user: true,
              ride: {
                include: { creator: true },
              },
            },
          },
          creator: true,
        },
      }),
      this.prisma.ride.count(),
    ]);

    return {
      data: rides,
      total,
    };
  }

  /**
   * Atualiza os dados de um pedal.
   *
   * @param id - ID do pedal a ser atualizado.
   * @param data - Dados a serem atualizados.
   * @returns Promessa contendo o pedal atualizado.
   */
  async update(id: string, data: UpdateRideInput): Promise<RideModel> {
    return await this.prisma.ride.update({
      where: { id },
      data,
      include: {
        subscriptions: {
          include: {
            user: true,
            ride: {
              include: { creator: true },
            },
          },
        },
        creator: true,
      },
    });
  }

  /**
   * Remove um pedal pelo seu ID.
   *
   * @param id - ID do pedal.
   * @returns Promessa de exclusão (void).
   */
  async delete(id: string) {
    await this.prisma.ride.delete({
      where: { id },
      include: { subscriptions: true, creator: true },
    });
  }
}
