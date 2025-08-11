"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const subscription_resolver_1 = require("../../subscription.resolver");
describe("SubscriptionResolver", () => {
    let subscriptionResolver;
    let subscriptionServiceMock;
    const fakeUserId = "user-1";
    beforeEach(() => {
        subscriptionServiceMock = {
            subscribeToRide: jest.fn(),
            getAllRidesSubscribedByUser: jest.fn(),
        };
        subscriptionResolver = new subscription_resolver_1.SubscriptionResolver(subscriptionServiceMock);
        jest.clearAllMocks();
    });
    describe("subscribeToRide", () => {
        it("deve inscrever usuário no pedal com sucesso", async () => {
            const ride_id = "ride-123";
            const fakeSubscription = {
                id: "sub-1",
                ride_id,
                user_id: fakeUserId,
                created_at: new Date(),
                updated_at: new Date(),
                user: {
                    id: fakeUserId,
                    name: "Fulano",
                    email: "fulano@test.com",
                },
                ride: {
                    id: ride_id,
                    name: "Passeio Legal",
                    start_date_registration: new Date("2025-08-01"),
                    end_date_registration: new Date("2025-08-10"),
                    start_date: new Date("2025-08-15"),
                    creator_id: "creator-1",
                    creator: {
                        id: "creator-1",
                        email: "fulano@test.com",
                        name: "Fulano",
                    },
                    start_place: "Praça Central",
                    additional_information: "Informação adicional",
                    participants_limit: 100,
                    subscriptions: [],
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                subscription_date: new Date("2025-08-01"),
            };
            subscriptionServiceMock.subscribeToRide.mockResolvedValue(fakeSubscription);
            const context = { user: { id: fakeUserId } };
            const result = await subscriptionResolver.subscribeToRide(ride_id, context);
            expect(subscriptionServiceMock.subscribeToRide).toHaveBeenCalledWith(ride_id, fakeUserId);
            expect(result).toEqual(fakeSubscription);
        });
        it("deve propagar erro do serviço caso falhe a inscrição", async () => {
            const ride_id = "ride-123";
            const error = new Error("Erro ao inscrever");
            subscriptionServiceMock.subscribeToRide.mockRejectedValue(error);
            const context = { user: { id: fakeUserId } };
            await expect(subscriptionResolver.subscribeToRide(ride_id, context)).rejects.toThrow("Erro ao inscrever");
            expect(subscriptionServiceMock.subscribeToRide).toHaveBeenCalledWith(ride_id, fakeUserId);
        });
    });
    describe("mySubscribedRides", () => {
        it("deve retornar lista de pedais inscritos do usuário", async () => {
            const rides = [
                {
                    id: "ride-1",
                    name: "Pedal 1",
                    start_date_registration: new Date("2025-08-01"),
                    end_date_registration: new Date("2025-08-05"),
                    start_date: new Date("2025-08-10"),
                    creator: { id: "creator-1" },
                    start_place: "Praça 1",
                    participants_limit: 100,
                    additional_information: null,
                    creator_id: "creator-1",
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    id: "ride-2",
                    name: "Pedal 2",
                    start_date_registration: new Date("2025-09-01"),
                    end_date_registration: new Date("2025-09-05"),
                    start_date: new Date("2025-09-10"),
                    creator: { id: "creator-2" },
                    start_place: "Praça 2",
                    participants_limit: 100,
                    additional_information: null,
                    creator_id: "creator-1",
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            ];
            subscriptionServiceMock.getAllRidesSubscribedByUser.mockResolvedValue(rides);
            const context = { user: { id: fakeUserId } };
            const result = await subscriptionResolver.mySubscribedRides(context);
            expect(subscriptionServiceMock.getAllRidesSubscribedByUser).toHaveBeenCalledWith(fakeUserId);
            expect(result).toEqual(rides);
        });
        it("deve propagar erro do serviço ao buscar pedais inscritos", async () => {
            const error = new Error("Erro ao buscar inscritos");
            subscriptionServiceMock.getAllRidesSubscribedByUser.mockRejectedValue(error);
            const context = { user: { id: fakeUserId } };
            await expect(subscriptionResolver.mySubscribedRides(context)).rejects.toThrow("Erro ao buscar inscritos");
            expect(subscriptionServiceMock.getAllRidesSubscribedByUser).toHaveBeenCalledWith(fakeUserId);
        });
    });
});
