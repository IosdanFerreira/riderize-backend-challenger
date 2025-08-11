"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const not_found_error_1 = require("../../../../../shared/errors/not-found.error");
const generate_pagination_utils_1 = require("../../../../../shared/utils/generate-pagination.utils");
const ride_service_1 = require("../../ride.service");
const validation_error_1 = require("../../../../../shared/errors/validation.error");
jest.mock("../../../../../shared/utils/generate-pagination.utils", () => ({
    Paginator: {
        buildPagination: jest.fn(),
    },
}));
describe("RideService unit tests", () => {
    let rideService;
    let rideRepository;
    const fakeRide = {
        id: "ride-1",
        name: "Passeio no parque",
        start_date_registration: new Date("2025-08-20"),
        end_date_registration: new Date("2025-08-25"),
        start_date: new Date("2025-08-30"),
        creator: { id: "user-1" },
        start_place: "Parque Central",
        additional_information: "Informação adicional",
        participants_limit: 100,
        creator_id: "creator-1",
        created_at: new Date(),
        updated_at: new Date(),
    };
    beforeEach(() => {
        rideRepository = {
            create: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findManyByCreatorId: jest.fn(),
            findAllWithCount: jest.fn(),
        };
        const redisClientMock = {
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
            // ... outros métodos se precisar
        };
        rideService = new ride_service_1.RideService(rideRepository, redisClientMock);
        jest.clearAllMocks();
    });
    describe("createRide", () => {
        it("deve criar uma ride quando as datas são válidas", async () => {
            const input = {
                name: "Passeio de bike",
                start_date_registration: new Date("2025-08-20"),
                end_date_registration: new Date("2025-08-25"),
                start_date: new Date("2025-08-30"),
            };
            rideRepository.create.mockResolvedValue(fakeRide);
            const result = await rideService.createRide(input, "user-1");
            expect(rideRepository.create).toHaveBeenCalledWith(input, "user-1");
            expect(result).toEqual(fakeRide);
        });
        it("deve lançar ValidationError se a data final de inscrição for no passado", async () => {
            const input = {
                start_date_registration: new Date("2025-08-01"),
                end_date_registration: new Date("2020-01-01"),
                start_date: new Date("2025-08-10"),
            };
            await expect(rideService.createRide(input, "user-1")).rejects.toThrow(validation_error_1.ValidationError);
        });
        it("deve lançar ValidationError se datas forem inconsistentes", async () => {
            const input = {
                start_date_registration: new Date("2025-08-25"),
                end_date_registration: new Date("2025-08-20"),
                start_date: new Date("2025-08-30"),
            };
            await expect(rideService.createRide(input, "user-1")).rejects.toThrow(validation_error_1.ValidationError);
        });
    });
    describe("updateRide", () => {
        it("deve atualizar a ride quando usuário for criador", async () => {
            rideRepository.findById.mockResolvedValue(fakeRide);
            rideRepository.update.mockResolvedValue({
                ...fakeRide,
                name: "Novo nome",
            });
            const input = { name: "Novo nome" };
            const result = await rideService.updateRide("ride-1", input, "user-1");
            expect(rideRepository.findById).toHaveBeenCalledWith("ride-1");
            expect(rideRepository.update).toHaveBeenCalledWith("ride-1", input);
            expect(result.name).toBe("Novo nome");
        });
        it("deve lançar NotFoundError se ride não existir", async () => {
            rideRepository.findById.mockResolvedValue(null);
            await expect(rideService.updateRide("ride-1", {}, "user-1")).rejects.toThrow(not_found_error_1.NotFoundError);
        });
        it("deve lançar erro se usuário não for criador", async () => {
            rideRepository.findById.mockResolvedValue({
                ...fakeRide,
                creator: { id: "outro-usuario" },
            });
            await expect(rideService.updateRide("ride-1", {}, "user-1")).rejects.toThrow("Usuário não autorizado");
        });
        it("deve lançar ValidationError se novas datas forem inválidas", async () => {
            rideRepository.findById.mockResolvedValue(fakeRide);
            const input = {
                start_date_registration: new Date("2025-08-25"),
                end_date_registration: new Date("2025-08-20"),
            };
            await expect(rideService.updateRide("ride-1", input, "user-1")).rejects.toThrow(validation_error_1.ValidationError);
        });
    });
    describe("deleteRide", () => {
        it("deve deletar ride quando usuário for criador", async () => {
            rideRepository.findById.mockResolvedValue(fakeRide);
            const result = await rideService.deleteRide("ride-1", "user-1");
            expect(rideRepository.delete).toHaveBeenCalledWith("ride-1");
            expect(result).toBe(true);
        });
        it("deve lançar NotFoundError se ride não existir", async () => {
            rideRepository.findById.mockResolvedValue(null);
            await expect(rideService.deleteRide("ride-1", "user-1")).rejects.toThrow(not_found_error_1.NotFoundError);
        });
        it("deve lançar erro se usuário não for criador", async () => {
            rideRepository.findById.mockResolvedValue({
                ...fakeRide,
                creator: { id: "outro-usuario" },
            });
            await expect(rideService.deleteRide("ride-1", "user-1")).rejects.toThrow("Usuário não autorizado");
        });
    });
    describe("getRidesCreatedByUser", () => {
        it("deve retornar lista de rides", async () => {
            rideRepository.findManyByCreatorId.mockResolvedValue([fakeRide]);
            const result = await rideService.getRidesCreatedByUser("user-1");
            expect(result).toEqual([fakeRide]);
        });
        it("deve lançar NotFoundError se não houver rides", async () => {
            rideRepository.findManyByCreatorId.mockResolvedValue(null);
            await expect(rideService.getRidesCreatedByUser("user-1")).rejects.toThrow(not_found_error_1.NotFoundError);
        });
    });
    describe("getAllRidesPaginated", () => {
        it("deve retornar paginação corretamente", async () => {
            const paginatedData = { data: [fakeRide], total: 1 };
            rideRepository.findAllWithCount.mockResolvedValue(paginatedData);
            generate_pagination_utils_1.Paginator.buildPagination.mockReturnValue({
                pagination: {
                    total_items: 1,
                    page: 1,
                    per_page: 10,
                },
                items: [fakeRide],
            });
            const result = await rideService.getAllRidesPaginated(1, 10);
            expect(rideRepository.findAllWithCount).toHaveBeenCalledWith(1, 10);
            expect(generate_pagination_utils_1.Paginator.buildPagination).toHaveBeenCalledWith([fakeRide], 1, {
                page: 1,
                per_page: 10,
            });
            expect(result.pagination.total_items).toBe(1);
            expect(result.items).toEqual([fakeRide]);
        });
    });
    describe("getRideById", () => {
        it("deve retornar ride quando encontrada", async () => {
            rideRepository.findById.mockResolvedValue(fakeRide);
            const result = await rideService.getRideById("ride-1");
            expect(result).toEqual(fakeRide);
        });
        it("deve lançar NotFoundError se ride não existir", async () => {
            rideRepository.findById.mockResolvedValue(null);
            await expect(rideService.getRideById("ride-1")).rejects.toThrow(not_found_error_1.NotFoundError);
        });
    });
});
