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
exports.CreateRideInput = void 0;
const type_graphql_1 = require("type-graphql");
const class_validator_1 = require("class-validator");
let CreateRideInput = class CreateRideInput {
};
exports.CreateRideInput = CreateRideInput;
__decorate([
    (0, type_graphql_1.Field)(),
    (0, class_validator_1.IsString)({ message: "O nome deve ser uma string" }),
    __metadata("design:type", String)
], CreateRideInput.prototype, "name", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, class_validator_1.IsDate)({ message: "A data de inicio do pedal deve ser do tipo date" }),
    __metadata("design:type", Date)
], CreateRideInput.prototype, "start_date", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, class_validator_1.IsDate)({ message: "A data de inicio das inscrições deve ser do tipo date" }),
    __metadata("design:type", Date)
], CreateRideInput.prototype, "start_date_registration", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, class_validator_1.IsDate)({ message: "A data de fim das inscrições deve ser do tipo date" }),
    __metadata("design:type", Date)
], CreateRideInput.prototype, "end_date_registration", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, class_validator_1.IsString)({ message: "O nome do local deve ser uma string" }),
    __metadata("design:type", String)
], CreateRideInput.prototype, "start_place", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsString)({ message: "A informação adicional deve ser uma string" }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateRideInput.prototype, "additional_information", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int, { nullable: true }),
    (0, class_validator_1.IsInt)({ message: "O limite de participantes deve ser um number" }),
    (0, class_validator_1.Min)(1, { message: "O limite de participantes deve ser maior que 0" }),
    __metadata("design:type", Number)
], CreateRideInput.prototype, "participants_limit", void 0);
exports.CreateRideInput = CreateRideInput = __decorate([
    (0, type_graphql_1.InputType)()
], CreateRideInput);
