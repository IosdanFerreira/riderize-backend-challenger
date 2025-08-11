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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionService = void 0;
const not_found_error_1 = require("../../../shared/errors/not-found.error");
const ride_repository_1 = require("../../ride/repositories/ride.repository");
const typedi_1 = require("typedi");
const subscription_repository_1 = require("../repositories/subscription.repository");
const validation_error_1 = require("../../../shared/errors/validation.error");
let SubscriptionService = class SubscriptionService {
    constructor(subscriptionRepository, rideRepository) {
        this.subscriptionRepository = subscriptionRepository;
        this.rideRepository = rideRepository;
    }
    /**
     * Inscreve o usuário em um pedal (ride).
     * Aplica todas as regras de negócio exigidas pelo desafio.
     */
    async subscribeToRide(ride_id, user_id) {
        const ride = await this.rideRepository.findById(ride_id);
        if (!ride) {
            throw new not_found_error_1.NotFoundError("Pedal não encontrado");
        }
        const now = new Date();
        // Valida período de inscrição
        if (now < ride.start_date_registration) {
            throw new validation_error_1.ValidationError("Período de inscrição ainda não começou", [
                {
                    property: "start_date_registration",
                    message: "Período de inscrição ainda não chegou",
                },
            ]);
        }
        if (now > ride.end_date_registration) {
            throw new validation_error_1.ValidationError("Período de inscrição encerrado", [
                {
                    property: "end_date_registration",
                    message: "Período de inscrição encerrado",
                },
            ]);
        }
        // Evitar duplicidade na inscrição
        const alreadySubscribed = await this.subscriptionRepository.findFirst(ride_id, user_id);
        if (alreadySubscribed) {
            throw new Error("Usuário já está inscrito nesse pedal");
        }
        // Valida limite de participantes (se existir)
        const currentSubscriptions = ride.subscriptions?.length ?? 0;
        if (ride.participants_limit &&
            ride.participants_limit &&
            currentSubscriptions >= ride.participants_limit) {
            throw new Error("Limite de participantes atingido");
        }
        // 5. Criar inscrição
        return await this.subscriptionRepository.create({ ride_id }, user_id);
    }
    /**
     * Lista todos os pedais que um usuário se inscreveu.
     */
    async getAllRidesSubscribedByUser(user_id) {
        const subscriptions = await this.subscriptionRepository.findManyByUserId(user_id);
        return subscriptions.map((s) => s.ride);
    }
};
exports.SubscriptionService = SubscriptionService;
exports.SubscriptionService = SubscriptionService = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [subscription_repository_1.SubscriptionRepository,
        ride_repository_1.RideRepository])
], SubscriptionService);
