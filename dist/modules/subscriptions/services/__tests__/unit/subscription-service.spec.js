"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const not_found_error_1 = require("../../../../../shared/errors/not-found.error");
const subscription_service_1 = require("../../subscription.service");
describe("SubscriptionService Unit Tests", () => {
    let subscriptionService;
    let subscriptionRepository;
    let rideRepository;
    const fakeRide = {
        id: "ride-1",
        start_date_registration: new Date("2025-08-01"),
        end_date_registration: new Date("2025-08-30"),
        participants_limit: 5,
        subscriptions: [],
    };
    beforeEach(() => {
        subscriptionRepository = {
            findFirst: jest.fn(),
            create: jest.fn(),
            findManyByUserId: jest.fn(),
        };
        rideRepository = {
            findById: jest.fn(),
        };
        subscriptionService = new subscription_service_1.SubscriptionService(subscriptionRepository, rideRepository);
        jest.useFakeTimers();
        jest.setSystemTime(new Date("2025-08-15")); // data dentro do período de inscrição
    });
    afterEach(() => {
        jest.clearAllMocks();
        jest.useRealTimers();
    });
    describe("subscribeToRide", () => {
        it("deve inscrever usuário com sucesso", async () => {
            rideRepository.findById.mockResolvedValue(fakeRide);
            subscriptionRepository.findFirst.mockResolvedValue(null);
            subscriptionRepository.create.mockResolvedValue({ id: "sub-1" });
            const result = await subscriptionService.subscribeToRide("ride-1", "user-1");
            expect(rideRepository.findById).toHaveBeenCalledWith("ride-1");
            expect(subscriptionRepository.findFirst).toHaveBeenCalledWith("ride-1", "user-1");
            expect(subscriptionRepository.create).toHaveBeenCalledWith({ ride_id: "ride-1" }, "user-1");
            expect(result).toEqual({ id: "sub-1" });
        });
        it("deve lançar NotFoundError se ride não existir", async () => {
            rideRepository.findById.mockResolvedValue(null);
            await expect(subscriptionService.subscribeToRide("ride-1", "user-1")).rejects.toThrow(not_found_error_1.NotFoundError);
        });
        it("deve lançar erro se período de inscrição ainda não começou", async () => {
            rideRepository.findById.mockResolvedValue({
                ...fakeRide,
                start_date_registration: new Date("2025-08-20"),
            });
            await expect(subscriptionService.subscribeToRide("ride-1", "user-1")).rejects.toThrow("Período de inscrição ainda não começou");
        });
        it("deve lançar erro se período de inscrição já acabou", async () => {
            rideRepository.findById.mockResolvedValue({
                ...fakeRide,
                end_date_registration: new Date("2025-08-10"),
            });
            await expect(subscriptionService.subscribeToRide("ride-1", "user-1")).rejects.toThrow("Período de inscrição encerrado");
        });
        it("deve lançar erro se usuário já estiver inscrito", async () => {
            rideRepository.findById.mockResolvedValue(fakeRide);
            subscriptionRepository.findFirst.mockResolvedValue({
                id: "sub-1",
            });
            await expect(subscriptionService.subscribeToRide("ride-1", "user-1")).rejects.toThrow("Usuário já está inscrito nesse pedal");
        });
        it("deve lançar erro se limite de participantes for atingido", async () => {
            rideRepository.findById.mockResolvedValue({
                ...fakeRide,
                subscriptions: new Array(5).fill({}),
            });
            subscriptionRepository.findFirst.mockResolvedValue(null);
            await expect(subscriptionService.subscribeToRide("ride-1", "user-1")).rejects.toThrow("Limite de participantes atingido");
        });
    });
    describe("getAllRidesSubscribedByUser", () => {
        it("deve retornar lista de rides a partir das inscrições do usuário", async () => {
            const fakeSubscriptions = [
                { ride: { id: "ride-1" } },
                { ride: { id: "ride-2" } },
            ];
            subscriptionRepository.findManyByUserId.mockResolvedValue(fakeSubscriptions);
            const result = await subscriptionService.getAllRidesSubscribedByUser("user-1");
            expect(subscriptionRepository.findManyByUserId).toHaveBeenCalledWith("user-1");
            expect(result).toEqual([{ id: "ride-1" }, { id: "ride-2" }]);
        });
        it("deve retornar array vazio se usuário não tiver inscrições", async () => {
            subscriptionRepository.findManyByUserId.mockResolvedValue([]);
            const result = await subscriptionService.getAllRidesSubscribedByUser("user-1");
            expect(result).toEqual([]);
        });
    });
});
