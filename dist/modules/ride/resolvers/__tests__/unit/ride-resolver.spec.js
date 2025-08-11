"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const ride_resolver_1 = require("../../ride.resolver");
describe("RideResolver", () => {
    let rideResolver;
    let rideServiceMock;
    const fakeUserId = "user-1";
    beforeEach(() => {
        rideServiceMock = {
            createRide: jest.fn(),
            updateRide: jest.fn(),
            deleteRide: jest.fn(),
            getRidesCreatedByUser: jest.fn(),
            getRideById: jest.fn(),
            getAllRidesPaginated: jest.fn(),
        };
        rideResolver = new ride_resolver_1.RideResolver(rideServiceMock);
        jest.clearAllMocks();
    });
    const fakeRide = {
        id: "ride-1",
        name: "Passeio no parque",
        start_date_registration: new Date("2025-08-20"),
        end_date_registration: new Date("2025-08-25"),
        start_date: new Date("2025-08-30"),
        creator: { id: fakeUserId },
        start_place: "Parque Central",
        additional_information: null,
        participants_limit: null,
        creator_id: "creator-1",
        created_at: new Date(),
        updated_at: new Date(),
    };
    describe("createRide", () => {
        it("deve criar um novo pedal com sucesso", async () => {
            const input = { name: "Novo Pedal" };
            rideServiceMock.createRide.mockResolvedValue(fakeRide);
            const context = { user: { id: fakeUserId } };
            const result = await rideResolver.createRide(input, context);
            expect(rideServiceMock.createRide).toHaveBeenCalledWith(input, fakeUserId);
            expect(result).toEqual(fakeRide);
        });
    });
    describe("updateRide", () => {
        it("deve atualizar um pedal existente", async () => {
            const ride_id = "ride-1";
            const input = { name: "Pedal Atualizado" };
            rideServiceMock.updateRide.mockResolvedValue(fakeRide);
            const context = { user: { id: fakeUserId } };
            const result = await rideResolver.updateRide(ride_id, input, context);
            expect(rideServiceMock.updateRide).toHaveBeenCalledWith(ride_id, input, fakeUserId);
            expect(result).toEqual(fakeRide);
        });
    });
    describe("deleteRide", () => {
        it("deve deletar um pedal com sucesso e retornar true", async () => {
            const ride_id = "ride-1";
            rideServiceMock.deleteRide.mockResolvedValue(true);
            const context = { user: { id: fakeUserId } };
            const result = await rideResolver.deleteRide(ride_id, context);
            expect(rideServiceMock.deleteRide).toHaveBeenCalledWith(ride_id, fakeUserId);
            expect(result).toBe(true);
        });
    });
    describe("myCreatedRides", () => {
        it("deve retornar lista de pedais criados pelo usuário", async () => {
            rideServiceMock.getRidesCreatedByUser.mockResolvedValue([fakeRide]);
            const context = { user: { id: fakeUserId } };
            const result = await rideResolver.myCreatedRides(context);
            expect(rideServiceMock.getRidesCreatedByUser).toHaveBeenCalledWith(fakeUserId);
            expect(result).toEqual([fakeRide]);
        });
    });
    describe("findRideById", () => {
        it("deve retornar o pedal quando encontrado", async () => {
            const ride_id = "ride-1";
            rideServiceMock.getRideById.mockResolvedValue(fakeRide);
            const result = await rideResolver.findRideById(ride_id);
            expect(rideServiceMock.getRideById).toHaveBeenCalledWith(ride_id);
            expect(result).toEqual(fakeRide);
        });
    });
    describe("getAllRides", () => {
        it("deve retornar pedais paginados", async () => {
            const page = 1;
            const limit = 10;
            const paginatedResult = {
                items: [fakeRide],
                pagination: {
                    total_items: 1,
                    page,
                    per_page: limit,
                    total_pages: 1,
                    next_page: null,
                    prev_page: null,
                },
            };
            rideServiceMock.getAllRidesPaginated.mockResolvedValue(paginatedResult);
            const result = await rideResolver.getAllRides(page, limit);
            expect(rideServiceMock.getAllRidesPaginated).toHaveBeenCalledWith(page, limit);
            expect(result).toEqual(paginatedResult);
        });
    });
});
