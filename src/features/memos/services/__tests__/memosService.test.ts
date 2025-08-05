import type { Repository, ServiceResult } from "@shared/types";
import { beforeEach, describe, expect, test, vi } from "vitest";
import type { Memo } from "../../types";
import { MemosService } from "../memosService";

const createMockRepository = (): Repository<Memo> => ({
	getAll: vi.fn(),
	getById: vi.fn(),
	create: vi.fn(),
	update: vi.fn(),
	delete: vi.fn(),
	exists: vi.fn(),
});

describe("MemosService", () => {
	let mockRepository: Repository<Memo>;
	let memosService: MemosService;

	beforeEach(() => {
		mockRepository = createMockRepository();
		memosService = new MemosService(mockRepository);
	});

	describe("getAllMemos", () => {
		test("should call repository.getAll", async () => {
			const expectedResult: ServiceResult<Memo[]> = {
				success: true,
				data: [],
			};
			vi.mocked(mockRepository.getAll).mockResolvedValue(expectedResult);

			const result = await memosService.getAllMemos();

			expect(mockRepository.getAll).toHaveBeenCalledOnce();
			expect(result).toEqual(expectedResult);
		});
	});

	describe("getMemo", () => {
		test("should get memo by valid ID", async () => {
			const mockMemo: Memo = {
				id: "valid-id",
				title: "Test Memo",
				description: "Test Description",
				createdAt: Date.now(),
			};
			const expectedResult: ServiceResult<Memo> = {
				success: true,
				data: mockMemo,
			};
			vi.mocked(mockRepository.getById).mockResolvedValue(expectedResult);

			const result = await memosService.getMemo("valid-id");

			expect(mockRepository.getById).toHaveBeenCalledWith("valid-id");
			expect(result).toEqual(expectedResult);
		});

		test("should return error for empty ID", async () => {
			const result = await memosService.getMemo("");

			expect(result.success).toBe(false);
			expect(result.error).toBe("Invalid memo ID");
			expect(mockRepository.getById).not.toHaveBeenCalled();
		});

		test("should return error for invalid ID type", async () => {
			const result = await memosService.getMemo(null as any);

			expect(result.success).toBe(false);
			expect(result.error).toBe("Invalid memo ID");
			expect(mockRepository.getById).not.toHaveBeenCalled();
		});
	});

	describe("createMemo", () => {
		test("should create memo with valid data", async () => {
			const memoData = {
				title: "Valid Title",
				description: "Valid Description",
			};
			const expectedResult: ServiceResult<Memo> = {
				success: true,
				data: {
					id: "new-id",
					...memoData,
					createdAt: Date.now(),
				},
			};
			vi.mocked(mockRepository.create).mockResolvedValue(expectedResult);

			const result = await memosService.createMemo(memoData);

			expect(mockRepository.create).toHaveBeenCalledWith({
				title: "Valid Title",
				description: "Valid Description",
			});
			expect(result).toEqual(expectedResult);
		});

		test("should trim spaces in title and description", async () => {
			const memoData = {
				title: "  Title with spaces  ",
				description: "  Description with spaces  ",
			};
			const expectedResult: ServiceResult<Memo> = {
				success: true,
				data: {
					id: "new-id",
					title: "Title with spaces",
					description: "Description with spaces",
					createdAt: Date.now(),
				},
			};
			vi.mocked(mockRepository.create).mockResolvedValue(expectedResult);

			await memosService.createMemo(memoData);

			expect(mockRepository.create).toHaveBeenCalledWith({
				title: "Title with spaces",
				description: "Description with spaces",
			});
		});

		test("should return error for empty title", async () => {
			const result = await memosService.createMemo({
				title: "",
				description: "Valid Description",
			});

			expect(result.success).toBe(false);
			expect(result.error).toBe("Memo title is required");
			expect(mockRepository.create).not.toHaveBeenCalled();
		});

		test("should return error for whitespace-only title", async () => {
			const result = await memosService.createMemo({
				title: "   ",
				description: "Valid Description",
			});

			expect(result.success).toBe(false);
			expect(result.error).toBe("Memo title is required");
			expect(mockRepository.create).not.toHaveBeenCalled();
		});

		test("should return error for empty description", async () => {
			const result = await memosService.createMemo({
				title: "Valid Title",
				description: "",
			});

			expect(result.success).toBe(false);
			expect(result.error).toBe("Memo description is required");
			expect(mockRepository.create).not.toHaveBeenCalled();
		});

		test("should return error for whitespace-only description", async () => {
			const result = await memosService.createMemo({
				title: "Valid Title",
				description: "   ",
			});

			expect(result.success).toBe(false);
			expect(result.error).toBe("Memo description is required");
			expect(mockRepository.create).not.toHaveBeenCalled();
		});
	});

	describe("updateMemo", () => {
		beforeEach(() => {
			vi.mocked(mockRepository.exists).mockResolvedValue(true);
		});

		test("should update memo with valid data", async () => {
			const updateData = { title: "Updated Title" };
			const expectedResult: ServiceResult<Memo> = {
				success: true,
				data: {
					id: "test-id",
					title: "Updated Title",
					description: "Original Description",
					createdAt: Date.now(),
					updatedAt: Date.now(),
				},
			};
			vi.mocked(mockRepository.update).mockResolvedValue(expectedResult);

			const result = await memosService.updateMemo("test-id", updateData);

			expect(mockRepository.exists).toHaveBeenCalledWith("test-id");
			expect(mockRepository.update).toHaveBeenCalledWith("test-id", updateData);
			expect(result).toEqual(expectedResult);
		});

		test("should return error for invalid ID", async () => {
			const result = await memosService.updateMemo("", { title: "New Title" });

			expect(result.success).toBe(false);
			expect(result.error).toBe("Invalid memo ID");
			expect(mockRepository.exists).not.toHaveBeenCalled();
		});

		test("should return error for non-existent memo", async () => {
			vi.mocked(mockRepository.exists).mockResolvedValue(false);

			const result = await memosService.updateMemo("non-existent", {
				title: "New Title",
			});

			expect(result.success).toBe(false);
			expect(result.error).toBe("Memo not found");
			expect(mockRepository.update).not.toHaveBeenCalled();
		});

		test("should return error for empty title when updating", async () => {
			const result = await memosService.updateMemo("test-id", { title: "" });

			expect(result.success).toBe(false);
			expect(result.error).toBe("Memo title cannot be empty");
			expect(mockRepository.update).not.toHaveBeenCalled();
		});

		test("should return error for empty description when updating", async () => {
			const result = await memosService.updateMemo("test-id", {
				description: "  ",
			});

			expect(result.success).toBe(false);
			expect(result.error).toBe("Memo description cannot be empty");
			expect(mockRepository.update).not.toHaveBeenCalled();
		});

		test("should allow partial updates", async () => {
			const updateData = { title: "Only Title Updated" };
			vi.mocked(mockRepository.update).mockResolvedValue({
				success: true,
				data: {} as Memo,
			});

			await memosService.updateMemo("test-id", updateData);

			expect(mockRepository.update).toHaveBeenCalledWith("test-id", updateData);
		});
	});

	describe("deleteMemo", () => {
		test("should delete memo with valid ID", async () => {
			const expectedResult: ServiceResult<void> = { success: true };
			vi.mocked(mockRepository.delete).mockResolvedValue(expectedResult);

			const result = await memosService.deleteMemo("valid-id");

			expect(mockRepository.delete).toHaveBeenCalledWith("valid-id");
			expect(result).toEqual(expectedResult);
		});

		test("should return error for invalid ID", async () => {
			const result = await memosService.deleteMemo("");

			expect(result.success).toBe(false);
			expect(result.error).toBe("Invalid memo ID");
			expect(mockRepository.delete).not.toHaveBeenCalled();
		});
	});

	describe("memoExists", () => {
		test("should check memo existence", async () => {
			vi.mocked(mockRepository.exists).mockResolvedValue(true);

			const result = await memosService.memoExists("test-id");

			expect(mockRepository.exists).toHaveBeenCalledWith("test-id");
			expect(result).toBe(true);
		});

		test("should return false for invalid ID", async () => {
			const result = await memosService.memoExists("");

			expect(result).toBe(false);
			expect(mockRepository.exists).not.toHaveBeenCalled();
		});

		test("should return false for null ID", async () => {
			const result = await memosService.memoExists(null as any);

			expect(result).toBe(false);
			expect(mockRepository.exists).not.toHaveBeenCalled();
		});
	});
});
