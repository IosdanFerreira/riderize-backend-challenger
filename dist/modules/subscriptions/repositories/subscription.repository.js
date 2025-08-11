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
exports.SubscriptionRepository = void 0;
const client_1 = require("@prisma/client");
const typedi_1 = require("typedi");
let SubscriptionRepository = class SubscriptionRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    /**
     * Busca a primeira inscrição encontrada para um usuário em um pedal específico.
     *
     * @param ride_id - ID do pedal (ride).
     * @param user_id - ID do usuário inscrito.
     * @returns Promessa com a inscrição encontrada ou `null` caso não exista.
     */
    async findFirst(ride_id, user_id) {
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
    async create(data, user_id) {
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
    async findManyByUserId(user_id) {
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
    async delete(ride_id, user_id) {
        return this.prisma.rideSubscription.deleteMany({
            where: {
                ride_id,
                user_id,
            },
        });
    }
};
exports.SubscriptionRepository = SubscriptionRepository;
exports.SubscriptionRepository = SubscriptionRepository = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typedi_1.Inject)("prisma")),
    __metadata("design:paramtypes", [client_1.PrismaClient])
], SubscriptionRepository);
