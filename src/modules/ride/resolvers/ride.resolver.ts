import {
  Resolver,
  Mutation,
  Arg,
  Ctx,
  UseMiddleware,
  Query,
  Int,
} from "type-graphql";
import { Inject, Service } from "typedi";
import { IsPrivate } from "../../../shared/decorators/private-route.decorator";
import { RideService } from "../services/ride.service";
import { CreateRideInput } from "../dto/create-ride.input.dto";
import { UpdateRideInput } from "../dto/update-ride.input.dto";
import { RideModel } from "../models/ride.model";
import { PaginatedRides } from "../models/paginated-rides.model";

@Service()
@Resolver(() => RideModel)
export class RideResolver {
  constructor(
    @Inject(() => RideService)
    private readonly rideService: RideService
  ) {}

  /**
   * Cria um novo pedal.
   *
   * @param input - Dados de criação do pedal.
   * @param context - Contexto GraphQL contendo o usuário autenticado.
   * @returns O pedal criado.
   */
  @Mutation(() => RideModel)
  @UseMiddleware(IsPrivate)
  async createRide(@Arg("input") input: CreateRideInput, @Ctx() context: any) {
    return this.rideService.createRide(input, context.user.id);
  }

  /**
   * Atualiza um pedal existente.
   *
   * @param ride_id - ID do pedal a ser atualizado.
   * @param input - Dados a serem atualizados.
   * @param context - Contexto GraphQL contendo o usuário autenticado.
   * @returns O pedal atualizado.
   */
  @Mutation(() => RideModel)
  @UseMiddleware(IsPrivate)
  async updateRide(
    @Arg("ride_id") ride_id: string,
    @Arg("input") input: UpdateRideInput,
    @Ctx() context: any
  ) {
    return await this.rideService.updateRide(ride_id, input, context.user.id);
  }

  /**
   * Remove um pedal.
   *
   * @param ride_id - ID do pedal a ser removido.
   * @param context - Contexto GraphQL contendo o usuário autenticado.
   * @returns `true` se removido com sucesso.
   */
  @Mutation(() => Boolean)
  @UseMiddleware(IsPrivate)
  async deleteRide(@Arg("ride_id") ride_id: string, @Ctx() context: any) {
    await this.rideService.deleteRide(ride_id, context.user.id);
    return true;
  }

  /**
   * Lista todos os pedais criados pelo usuário autenticado.
   *
   * @param context - Contexto GraphQL contendo o usuário autenticado.
   * @returns Lista de pedais criados pelo usuário.
   */
  @Query(() => [RideModel])
  @UseMiddleware(IsPrivate)
  async myCreatedRides(@Ctx() context: any) {
    return await this.rideService.getRidesCreatedByUser(context.user.id);
  }

  /**
   * Busca um pedal pelo seu ID.
   *
   * @param ride_id - ID do pedal.
   * @returns O pedal encontrado ou `null` se não existir.
   */
  @Query(() => RideModel)
  @UseMiddleware(IsPrivate)
  async findRideById(@Arg("ride_id") ride_id: string) {
    return await this.rideService.getRideById(ride_id);
  }

  /**
   * Lista todos os pedais com paginação.
   *
   * @param page - Número da página (iniciando em 1).
   * @param limit - Quantidade de registros por página.
   * @returns Lista paginada de pedais e contagem total.
   */
  @Query(() => PaginatedRides)
  @UseMiddleware(IsPrivate)
  async getAllRides(
    @Arg("page", () => Int) page: number,
    @Arg("limit", () => Int) limit: number
  ) {
    return await this.rideService.getAllRidesPaginated(page, limit);
  }
}
