import { CreateRideInput } from "../dto/create-ride.input.dto";
import { NotFoundError } from "../../../shared/errors/not-found.error";
import { PaginatedRides } from "../models/paginated-rides.model";
import { Paginator } from "../../../shared/utils/generate-pagination.utils";
import { RideModel } from "../models/ride.model";
import { RideRepository } from "../repositories/ride.repository";
import { Inject, Service } from "typedi";
import { UpdateRideInput } from "../dto/update-ride.input.dto";
import { ValidationError } from "../../../shared/errors/validation.error";
import Redis from "ioredis";

/**
 * Serviço responsável por operações relacionadas aos pedais.
 */
@Service()
export class RideService {
  private readonly CACHE_TTL = 60;

  constructor(
    private readonly rideRepository: RideRepository,
    @Inject("redisClient")
    private readonly redisClient: Redis
  ) {}

  private getCacheKey(page: number, limit: number): string {
    return `rides:page=${page}:limit=${limit}`;
  }

  async clearAllRidesCache(): Promise<void> {
    const pattern = "rides:*"; // Padrão mais abrangente
    let cursor = "0";
    let keys: any[] = [];

    do {
      const reply = await this.redisClient.scan(
        cursor,
        "MATCH",
        pattern,
        "COUNT",
        100
      );

      cursor = reply[0];
      const foundKeys = reply[1];

      if (foundKeys.length > 0) {
        keys = keys.concat(foundKeys);
      }
    } while (cursor !== "0");

    if (keys.length > 0) {
      // Deleta em lotes para evitar problemas com muitas chaves
      const pipeline = this.redisClient.pipeline();
      keys.forEach((key) => pipeline.del(key));
      await pipeline.exec();

      console.log(`[clearAllRidesCache] ${keys.length} chaves deletadas.`);
    } else {
      console.log(
        "[clearAllRidesCache] Nenhuma chave encontrada para deletar."
      );
    }
  }

  /**
   * Cria um novo pedal
   *
   * @param input - Dados para criação da pedal.
   * @param creator_id - ID do usuário criador da pedal.
   * @throws Error se datas forem inconsistentes ou passadas.
   * @returns A pedal criada.
   */
  async createRide(
    input: CreateRideInput,
    creator_id: string
  ): Promise<RideModel> {
    this.validateDates(
      input.start_date_registration,
      input.end_date_registration,
      input.start_date,
      new Date()
    );

    const ride = await this.rideRepository.create(input, creator_id);

    await this.clearAllRidesCache();

    return ride;
  }

  /**
   * Atualiza um pedal existente.
   *
   * @param ride_id - ID do pedal a ser atualizada.
   * @param input - Dados de atualização.
   * @param user_id - ID do usuário solicitando a atualização.
   * @throws NotFoundError se o pedal não for encontrado.
   * @throws Error se o usuário não for o criador do pedal.
   * @returns O pedal atualizado.
   */
  async updateRide(
    ride_id: string,
    input: UpdateRideInput,
    user_id: string
  ): Promise<RideModel> {
    const ride = await this.rideRepository.findById(ride_id);

    if (!ride) {
      throw new NotFoundError("Pedal não encontrado");
    }

    if (ride.creator.id !== user_id) {
      throw new Error("Usuário não autorizado a editar esta ride");
    }

    const now = new Date();

    // Usa valores atualizados ou atuais do banco
    const startDateRegistration =
      input.start_date_registration ?? ride.start_date_registration;

    const endDateRegistration =
      input.end_date_registration ?? ride.end_date_registration;

    const startDate = input.start_date ?? ride.start_date;

    this.validateDates(
      startDateRegistration,
      endDateRegistration,
      startDate,
      now
    );

    const rideUpdated = await this.rideRepository.update(ride_id, input);

    await this.clearAllRidesCache();

    return rideUpdated;
  }

  /**
   * Exclui uma pedal.
   *
   * @param ride_id - ID do pedal a ser deletada.
   * @param user_id - ID do usuário solicitando a exclusão.
   * @throws NotFoundError se o pedal não for encontrado.
   * @throws Error se o usuário não for o criador do pedal.
   * @returns O pedal excluído.
   */
  async deleteRide(ride_id: string, user_id: string): Promise<Boolean> {
    const ride = await this.rideRepository.findById(ride_id);

    if (!ride) {
      throw new NotFoundError("Pedal não encontrado");
    }

    if (ride.creator.id !== user_id) {
      throw new Error("Usuário não autorizado a deletar este pedal");
    }

    await this.rideRepository.delete(ride_id);

    await this.clearAllRidesCache();

    return true;
  }

  /**
   * Lista todos os pedais criadas por um usuário.
   *
   * @param user_id - ID do usuário.
   * @returns Lista de pedais criados.
   */
  async getRidesCreatedByUser(user_id: string): Promise<RideModel[]> {
    const rides = await this.rideRepository.findManyByCreatorId(user_id);

    if (!rides) {
      throw new NotFoundError("Nenhum pedal encontrado");
    }

    return rides;
  }

  /**
   * Lista todos os pedais do banco de dados de forma paginada.
   *
   * @param page - Número da página a ser retornada.
   * @param limit - Número de pedais por página.
   * @returns Um objeto com as pedais e informações de paginação.
   */
  async getAllRidesPaginated(
    page: number,
    limit: number
  ): Promise<PaginatedRides> {
    const cacheKey = this.getCacheKey(page, limit);

    const cached = await this.redisClient.get(cacheKey);

    if (cached) {
      console.log(
        `Retornando lista de pedais do cache (page=${page}, limit=${limit})`
      );
      return JSON.parse(cached);
    }

    const rides = await this.rideRepository.findAllWithCount(page, limit);

    const paginatedRides = Paginator.buildPagination(rides.data, rides.total, {
      page,
      per_page: limit,
    });

    await this.redisClient.set(
      cacheKey,
      JSON.stringify(paginatedRides),
      "EX",
      this.CACHE_TTL
    );

    console.log(`[getAllRidesPaginated] Cache setado para chave ${cacheKey}`);

    return paginatedRides;
  }

  /**
   * Retorna um pedal com base no seu ID.
   *
   * @param ride_id - ID do pedal a ser retornado.
   * @throws NotFoundError se o pedal não for encontrada.
   * @returns O pedal encontrado.
   */
  async getRideById(ride_id: string): Promise<RideModel> {
    const ride = await this.rideRepository.findById(ride_id);

    if (!ride) {
      throw new NotFoundError("Pedal não encontrada");
    }

    return ride;
  }

  private validateDates(
    startDateRegistration: Date,
    endDateRegistration: Date,
    startDate: Date,
    now: Date
  ): void {
    if (endDateRegistration < now) {
      throw new ValidationError("Data final de inscrição está inválida", [
        {
          property: "end_date_registration",
          message:
            "Data final de inscrição não pode ser menor que a data atual",
        },
      ]);
    }

    if (
      startDateRegistration > endDateRegistration ||
      endDateRegistration > startDate
    ) {
      throw new ValidationError(
        "Datas de inscrição ou início estão inconsistentes"
      );
    }
  }
}
