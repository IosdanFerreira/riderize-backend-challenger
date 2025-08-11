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
exports.RideModel = void 0;
// src/modules/rides/model/ride.model.ts
const type_graphql_1 = require("type-graphql");
const subscription_model_1 = require("../../subscriptions/model/subscription.model");
const user_model_1 = require("../../user/model/user.model");
let RideModel = class RideModel {
};
exports.RideModel = RideModel;
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.ID),
    __metadata("design:type", String)
], RideModel.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], RideModel.prototype, "name", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Date),
    __metadata("design:type", Date)
], RideModel.prototype, "start_date", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Date),
    __metadata("design:type", Date)
], RideModel.prototype, "start_date_registration", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Date),
    __metadata("design:type", Date)
], RideModel.prototype, "end_date_registration", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], RideModel.prototype, "start_place", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", Object)
], RideModel.prototype, "additional_information", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int, { nullable: true }),
    __metadata("design:type", Object)
], RideModel.prototype, "participants_limit", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], RideModel.prototype, "creator_id", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => user_model_1.UserModel),
    __metadata("design:type", user_model_1.UserModel)
], RideModel.prototype, "creator", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [subscription_model_1.SubscriptionModel], { nullable: true }),
    __metadata("design:type", Object)
], RideModel.prototype, "subscriptions", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Date),
    __metadata("design:type", Date)
], RideModel.prototype, "created_at", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Date),
    __metadata("design:type", Date)
], RideModel.prototype, "updated_at", void 0);
exports.RideModel = RideModel = __decorate([
    (0, type_graphql_1.ObjectType)()
], RideModel);
