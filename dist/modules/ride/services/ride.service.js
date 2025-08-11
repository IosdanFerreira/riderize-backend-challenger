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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RideService = void 0;
const not_found_error_1 = require("../../../shared/errors/not-found.error");
const generate_pagination_utils_1 = require("../../../shared/utils/generate-pagination.utils");
const ride_repository_1 = require("../repositories/ride.repository");
const typedi_1 = require("typedi");
const validation_error_1 = require("../../../shared/errors/validation.error");
const ioredis_1 = __importDefault(require("ioredis"));
/**
 * Serviço responsável por operações relacionadas aos pedais.
 */
let RideService = class RideService {
    constructor(rideRepository, redisClient) {
        this.rideRepository = rideRepository;
        this.redisClient = redisClient;
        this.CACHE_TTL = 60;
    }
    getCacheKey(page, limit) {
        return `rides:page=${page}:limit=${limit}`;
    }
    async clearAllRidesCache() {
        const pattern = "rides:*"; // Padrão mais abrangente
        let cursor = "0";
        let keys = [];
        do {
            const reply = await this.redisClient.scan(cursor, "MATCH", pattern, "COUNT", 100);
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
        }
        else {
            console.log("[clearAllRidesCache] Nenhuma chave encontrada para deletar.");
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
    async createRide(input, creator_id) {
        this.validateDates(input.start_date_registration, input.end_date_registration, input.start_date, new Date());
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
    async updateRide(ride_id, input, user_id) {
        const ride = await this.rideRepository.findById(ride_id);
        if (!ride) {
            throw new not_found_error_1.NotFoundError("Pedal não encontrado");
        }
        if (ride.creator.id !== user_id) {
            throw new Error("Usuário não autorizado a editar esta ride");
        }
        const now = new Date();
        // Usa valores atualizados ou atuais do banco
        const startDateRegistration = input.start_date_registration ?? ride.start_date_registration;
        const endDateRegistration = input.end_date_registration ?? ride.end_date_registration;
        const startDate = input.start_date ?? ride.start_date;
        this.validateDates(startDateRegistration, endDateRegistration, startDate, now);
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
    async deleteRide(ride_id, user_id) {
        const ride = await this.rideRepository.findById(ride_id);
        if (!ride) {
            throw new not_found_error_1.NotFoundError("Pedal não encontrado");
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
    async getRidesCreatedByUser(user_id) {
        const rides = await this.rideRepository.findManyByCreatorId(user_id);
        if (!rides) {
            throw new not_found_error_1.NotFoundError("Nenhum pedal encontrado");
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
    async getAllRidesPaginated(page, limit) {
        const cacheKey = this.getCacheKey(page, limit);
        const cached = await this.redisClient.get(cacheKey);
        if (cached) {
            console.log(`Retornando lista de pedais do cache (page=${page}, limit=${limit})`);
            return JSON.parse(cached);
        }
        const rides = await this.rideRepository.findAllWithCount(page, limit);
        const paginatedRides = generate_pagination_utils_1.Paginator.buildPagination(rides.data, rides.total, {
            page,
            per_page: limit,
        });
        await this.redisClient.set(cacheKey, JSON.stringify(paginatedRides), "EX", this.CACHE_TTL);
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
    async getRideById(ride_id) {
        const ride = await this.rideRepository.findById(ride_id);
        if (!ride) {
            throw new not_found_error_1.NotFoundError("Pedal não encontrada");
        }
        return ride;
    }
    validateDates(startDateRegistration, endDateRegistration, startDate, now) {
        if (endDateRegistration < now) {
            throw new validation_error_1.ValidationError("Data final de inscrição está inválida", [
                {
                    property: "end_date_registration",
                    message: "Data final de inscrição não pode ser menor que a data atual",
                },
            ]);
        }
        if (startDateRegistration > endDateRegistration ||
            endDateRegistration > startDate) {
            throw new validation_error_1.ValidationError("Datas de inscrição ou início estão inconsistentes");
        }
    }
};
exports.RideService = RideService;
exports.RideService = RideService = __decorate([
    (0, typedi_1.Service)(),
    __param(1, (0, typedi_1.Inject)("redisClient")),
    __metadata("design:paramtypes", [ride_repository_1.RideRepository,
        ioredis_1.default])
], RideService);
