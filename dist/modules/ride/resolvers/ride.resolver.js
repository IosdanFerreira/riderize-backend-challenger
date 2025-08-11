"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RideResolver = void 0;
const type_graphql_1 = require("type-graphql");
const typedi_1 = require("typedi");
const private_route_decorator_1 = require("../../../shared/decorators/private-route.decorator");
const ride_service_1 = require("../services/ride.service");
const create_ride_input_dto_1 = require("../dto/create-ride.input.dto");
const update_ride_input_dto_1 = require("../dto/update-ride.input.dto");
const ride_model_1 = require("../models/ride.model");
const paginated_rides_model_1 = require("../models/paginated-rides.model");
let RideResolver = class RideResolver {
    constructor(rideService) {
        this.rideService = rideService;
    }
    /**
     * Cria um novo pedal.
     *
     * @param input - Dados de criação do pedal.
     * @param context - Contexto GraphQL contendo o usuário autenticado.
     * @returns O pedal criado.
     */
    async createRide(input, context) {
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
    async updateRide(ride_id, input, context) {
        return await this.rideService.updateRide(ride_id, input, context.user.id);
    }
    /**
     * Remove um pedal.
     *
     * @param ride_id - ID do pedal a ser removido.
     * @param context - Contexto GraphQL contendo o usuário autenticado.
     * @returns `true` se removido com sucesso.
     */
    async deleteRide(ride_id, context) {
        await this.rideService.deleteRide(ride_id, context.user.id);
        return true;
    }
    /**
     * Lista todos os pedais criados pelo usuário autenticado.
     *
     * @param context - Contexto GraphQL contendo o usuário autenticado.
     * @returns Lista de pedais criados pelo usuário.
     */
    async myCreatedRides(context) {
        return await this.rideService.getRidesCreatedByUser(context.user.id);
    }
    /**
     * Busca um pedal pelo seu ID.
     *
     * @param ride_id - ID do pedal.
     * @returns O pedal encontrado ou `null` se não existir.
     */
    async findRideById(ride_id) {
        return await this.rideService.getRideById(ride_id);
    }
    /**
     * Lista todos os pedais com paginação.
     *
     * @param page - Número da página (iniciando em 1).
     * @param limit - Quantidade de registros por página.
     * @returns Lista paginada de pedais e contagem total.
     */
    async getAllRides(page, limit) {
        return await this.rideService.getAllRidesPaginated(page, limit);
    }
};
exports.RideResolver = RideResolver;
__decorate([
    (0, type_graphql_1.Mutation)(() => ride_model_1.RideModel),
    (0, type_graphql_1.UseMiddleware)(private_route_decorator_1.IsPrivate),
    __param(0, (0, type_graphql_1.Arg)("input")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_ride_input_dto_1.CreateRideInput, Object]),
    __metadata("design:returntype", Promise)
], RideResolver.prototype, "createRide", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => ride_model_1.RideModel),
    (0, type_graphql_1.UseMiddleware)(private_route_decorator_1.IsPrivate),
    __param(0, (0, type_graphql_1.Arg)("ride_id")),
    __param(1, (0, type_graphql_1.Arg)("input")),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_ride_input_dto_1.UpdateRideInput, Object]),
    __metadata("design:returntype", Promise)
], RideResolver.prototype, "updateRide", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    (0, type_graphql_1.UseMiddleware)(private_route_decorator_1.IsPrivate),
    __param(0, (0, type_graphql_1.Arg)("ride_id")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RideResolver.prototype, "deleteRide", null);
__decorate([
    (0, type_graphql_1.Query)(() => [ride_model_1.RideModel]),
    (0, type_graphql_1.UseMiddleware)(private_route_decorator_1.IsPrivate),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RideResolver.prototype, "myCreatedRides", null);
__decorate([
    (0, type_graphql_1.Query)(() => ride_model_1.RideModel),
    (0, type_graphql_1.UseMiddleware)(private_route_decorator_1.IsPrivate),
    __param(0, (0, type_graphql_1.Arg)("ride_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RideResolver.prototype, "findRideById", null);
__decorate([
    (0, type_graphql_1.Query)(() => paginated_rides_model_1.PaginatedRides),
    (0, type_graphql_1.UseMiddleware)(private_route_decorator_1.IsPrivate),
    __param(0, (0, type_graphql_1.Arg)("page", () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Arg)("limit", () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], RideResolver.prototype, "getAllRides", null);
exports.RideResolver = RideResolver = __decorate([
    (0, typedi_1.Service)(),
    (0, type_graphql_1.Resolver)(() => ride_model_1.RideModel),
    __param(0, (0, typedi_1.Inject)(() => ride_service_1.RideService)),
    __metadata("design:paramtypes", [ride_service_1.RideService])
], RideResolver);
