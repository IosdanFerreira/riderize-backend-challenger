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
exports.SubscriptionResolver = void 0;
const type_graphql_1 = require("type-graphql");
const typedi_1 = require("typedi");
const private_route_decorator_1 = require("../../../shared/decorators/private-route.decorator");
const subscription_model_1 = require("../model/subscription.model");
const ride_model_1 = require("../../ride/models/ride.model");
const subscription_service_1 = require("../services/subscription.service");
let SubscriptionResolver = class SubscriptionResolver {
    constructor(subscriptionService) {
        this.subscriptionService = subscriptionService;
    }
    /**
     * Inscreve o usuário logado em um pedal (ride)
     */
    async subscribeToRide(ride_id, context) {
        return this.subscriptionService.subscribeToRide(ride_id, context.user.id);
    }
    /**
     * Lista todos os pedais que o usuário logado se inscreveu
     */
    async mySubscribedRides(context) {
        return this.subscriptionService.getAllRidesSubscribedByUser(context.user.id);
    }
};
exports.SubscriptionResolver = SubscriptionResolver;
__decorate([
    (0, type_graphql_1.Mutation)(() => subscription_model_1.SubscriptionModel),
    (0, type_graphql_1.UseMiddleware)(private_route_decorator_1.IsPrivate),
    __param(0, (0, type_graphql_1.Arg)("ride_id")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SubscriptionResolver.prototype, "subscribeToRide", null);
__decorate([
    (0, type_graphql_1.Query)(() => [ride_model_1.RideModel]),
    (0, type_graphql_1.UseMiddleware)(private_route_decorator_1.IsPrivate),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SubscriptionResolver.prototype, "mySubscribedRides", null);
exports.SubscriptionResolver = SubscriptionResolver = __decorate([
    (0, typedi_1.Service)(),
    (0, type_graphql_1.Resolver)(() => subscription_model_1.SubscriptionModel),
    __param(0, (0, typedi_1.Inject)(() => subscription_service_1.SubscriptionService)),
    __metadata("design:paramtypes", [subscription_service_1.SubscriptionService])
], SubscriptionResolver);
