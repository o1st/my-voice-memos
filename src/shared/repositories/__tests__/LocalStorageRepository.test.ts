import { beforeEach, describe, expect, test } from "vitest";
import type { BaseEntity } from "../../types/repository";
import { LocalStorageRepository } from "../LocalStorageRepository";

interface TestEntity extends BaseEntity {
	name: string;
	value: number;
}

describe("LocalStorageRepository", () => {
	let repository: LocalStorageRepository<TestEntity>;
	const config = {
		storageKey: "test-storage",
		version: "1.0.0",
	};

	beforeEach(() => {
		repository = new LocalStorageRepository<TestEntity>(config);
	});

	describe("initialization", () => {
		test("should create initial storage on first run", () => {
			const stored = localStorage.getItem(config.storageKey);
			expect(stored).toBeTruthy();

			const data = JSON.parse(stored!);
			expect(data).toEqual({
				version: config.version,
				items: [],
			});
		});

		test("should not overwrite existing data", () => {
			const testData = {
				version: config.version,
				items: [{ id: "test", name: "Test", value: 1, createdAt: Date.now() }],
			};
			localStorage.setItem(config.storageKey, JSON.stringify(testData));

			new LocalStorageRepository<TestEntity>(config);

			const stored = localStorage.getItem(config.storageKey);
			expect(JSON.parse(stored!)).toEqual(testData);
		});
	});

	describe("getAll", () => {
		test("should return empty array for new storage", async () => {
			const result = await repository.getAll();

			expect(result.success).toBe(true);
			expect(result.data).toEqual([]);
		});

		test("should return all items sorted by creation date (newest first)", async () => {
			const now = Date.now();
			const testData = {
				version: config.version,
				items: [
					{ id: "1", name: "First", value: 1, createdAt: now - 1000 },
					{ id: "2", name: "Second", value: 2, createdAt: now },
					{ id: "3", name: "Third", value: 3, createdAt: now - 2000 },
				],
			};
			localStorage.setItem(config.storageKey, JSON.stringify(testData));

			const result = await repository.getAll();

			expect(result.success).toBe(true);
			expect(result.data).toHaveLength(3);
			expect(result.data?.[0].id).toBe("2");
			expect(result.data?.[1].id).toBe("1");
			expect(result.data?.[2].id).toBe("3");
		});
	});

	describe("getById", () => {
		beforeEach(() => {
			const testData = {
				version: config.version,
				items: [
					{ id: "test-1", name: "Test Item", value: 42, createdAt: Date.now() },
				],
			};
			localStorage.setItem(config.storageKey, JSON.stringify(testData));
		});

		test("should find item by ID", async () => {
			const result = await repository.getById("test-1");

			expect(result.success).toBe(true);
			expect(result.data).toEqual({
				id: "test-1",
				name: "Test Item",
				value: 42,
				createdAt: expect.any(Number),
			});
		});

		test("should return error for non-existent ID", async () => {
			const result = await repository.getById("non-existent");

			expect(result.success).toBe(false);
			expect(result.error).toBe("Item not found");
		});
	});

	describe("create", () => {
		test("should create new item with auto-generated ID and timestamps", async () => {
			const itemData = { name: "New Item", value: 100 };
			const result = await repository.create(itemData);

			expect(result.success).toBe(true);
			expect(result.data).toEqual({
				...itemData,
				id: expect.stringMatching(/^test-storage_\d+_[a-z0-9]+$/),
				createdAt: expect.any(Number),
			});
		});

		test("should add item to storage", async () => {
			const itemData = { name: "New Item", value: 100 };
			await repository.create(itemData);

			const allItems = await repository.getAll();
			expect(allItems.data).toHaveLength(1);
			expect(allItems.data?.[0].name).toBe("New Item");
		});
	});

	describe("update", () => {
		let existingId: string;

		beforeEach(async () => {
			const createResult = await repository.create({
				name: "Original",
				value: 50,
			});
			existingId = createResult.data?.id as string;
		});

		test("should update existing item", async () => {
			const updateData = { name: "Updated", value: 75 };
			const result = await repository.update(existingId, updateData);

			expect(result.success).toBe(true);
			expect(result.data).toEqual({
				id: existingId,
				name: "Updated",
				value: 75,
				createdAt: expect.any(Number),
				updatedAt: expect.any(Number),
			});
		});

		test("should preserve ID and createdAt when updating", async () => {
			const originalItem = await repository.getById(existingId);
			const updateData = { name: "Updated Name" };

			await new Promise((resolve) => setTimeout(resolve, 1));

			const result = await repository.update(existingId, updateData);

			expect(result.data?.id).toBe(originalItem.data?.id);
			expect(result.data?.createdAt).toBe(originalItem.data?.createdAt);
			expect(result.data?.updatedAt).toBeGreaterThan(
				originalItem.data?.createdAt as number,
			);
		});

		test("should return error for non-existent ID", async () => {
			const result = await repository.update("non-existent", { name: "Test" });

			expect(result.success).toBe(false);
			expect(result.error).toBe("Item not found");
		});
	});

	describe("delete", () => {
		let existingId: string;

		beforeEach(async () => {
			const createResult = await repository.create({
				name: "To Delete",
				value: 123,
			});
			existingId = createResult.data?.id as string;
		});

		test("should delete existing item", async () => {
			const result = await repository.delete(existingId);

			expect(result.success).toBe(true);

			const getResult = await repository.getById(existingId);
			expect(getResult.success).toBe(false);
		});

		test("should remove item from all items list", async () => {
			await repository.delete(existingId);

			const allItems = await repository.getAll();
			expect(allItems.data).toHaveLength(0);
		});

		test("should return error for non-existent ID", async () => {
			const result = await repository.delete("non-existent");

			expect(result.success).toBe(false);
			expect(result.error).toBe("Item not found");
		});
	});

	describe("exists", () => {
		let existingId: string;

		beforeEach(async () => {
			const createResult = await repository.create({
				name: "Existing",
				value: 999,
			});
			existingId = createResult.data?.id as string;
		});

		test("should return true for existing item", async () => {
			const exists = await repository.exists(existingId);
			expect(exists).toBe(true);
		});

		test("should return false for non-existent item", async () => {
			const exists = await repository.exists("non-existent");
			expect(exists).toBe(false);
		});
	});

	describe("error handling", () => {
		test("should handle corrupted data in localStorage", async () => {
			localStorage.setItem(config.storageKey, "invalid json");

			const result = await repository.getAll();

			expect(result.success).toBe(false);
			expect(result.error).toContain("Error reading data");
		});
	});
});
