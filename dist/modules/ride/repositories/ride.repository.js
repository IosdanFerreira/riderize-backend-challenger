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
exports.RideRepository = void 0;
const client_1 = require("@prisma/client");
const typedi_1 = require("typedi");
let RideRepository = class RideRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    /**
     * Cria um novo pedal (ride) associado a um usuário criador.
     *
     * @param data - Dados para criação do pedal.
     * @param creator_id - ID do usuário que está criando o pedal.
     * @returns Promessa contendo o pedal criado com informações do criador e inscrições.
     */
    async create(data, creator_id) {
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
    async findById(id) {
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
    async findManyByCreatorId(user_id) {
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
    async findAllWithCount(page, limit) {
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
    async update(id, data) {
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
    async delete(id) {
        await this.prisma.ride.delete({
            where: { id },
            include: { subscriptions: true, creator: true },
        });
    }
};
exports.RideRepository = RideRepository;
exports.RideRepository = RideRepository = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typedi_1.Inject)("prisma")),
    __metadata("design:paramtypes", [client_1.PrismaClient])
], RideRepository);
