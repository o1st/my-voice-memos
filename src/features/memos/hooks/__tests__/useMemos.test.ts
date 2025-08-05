import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import type { Memo } from "../../types";
import { useMemos } from "../useMemos";

vi.mock("../../services/memosService", () => ({
	memosService: {
		getAllMemos: vi.fn(),
		createMemo: vi.fn(),
		updateMemo: vi.fn(),
		deleteMemo: vi.fn(),
	},
}));

import type { ServiceResult } from "@shared/types";
import { memosService } from "../../services/memosService";

const mockMemosService = vi.mocked(memosService);

describe("useMemos", () => {
	const mockMemos: Memo[] = [
		{
			id: "memo-1",
			title: "First Memo",
			description: "First Description",
			createdAt: Date.now() - 1000,
		},
		{
			id: "memo-2",
			title: "Second Memo",
			description: "Second Description",
			createdAt: Date.now(),
		},
	];

	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("initialization", () => {
		test("should load all memos on initialization", async () => {
			mockMemosService.getAllMemos.mockResolvedValue({
				success: true,
				data: mockMemos,
			});

			const { result } = renderHook(() => useMemos());

			expect(result.current.loading).toBe(true);

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			expect(mockMemosService.getAllMemos).toHaveBeenCalledOnce();
			expect(result.current.memos).toEqual(mockMemos);
			expect(result.current.error).toBeNull();
		});

		test("should handle error on loading", async () => {
			mockMemosService.getAllMemos.mockResolvedValue({
				success: false,
				error: "Failed to load memos",
			});

			const { result } = renderHook(() => useMemos());

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			expect(result.current.memos).toEqual([]);
			expect(result.current.error).toBe("Failed to load memos");
		});

		test("should handle unexpected error", async () => {
			mockMemosService.getAllMemos.mockRejectedValue(
				new Error("Network error"),
			);

			const { result } = renderHook(() => useMemos());

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			expect(result.current.error).toBe("Unexpected error while loading memos");
		});
	});

	describe("refreshMemos", () => {
		test("should reload all memos", async () => {
			mockMemosService.getAllMemos
				.mockResolvedValueOnce({
					success: true,
					data: [],
				})
				.mockResolvedValueOnce({
					success: true,
					data: mockMemos,
				});

			const { result } = renderHook(() => useMemos());

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			expect(result.current.memos).toEqual([]);

			await act(async () => {
				await result.current.refreshMemos();
			});

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
				expect(result.current.memos).toEqual(mockMemos);
			});
			expect(mockMemosService.getAllMemos).toHaveBeenCalledTimes(2);
		});
	});

	describe("createMemo", () => {
		beforeEach(() => {
			mockMemosService.getAllMemos.mockResolvedValue({
				success: true,
				data: [],
			});
		});

		test("should successfully create memo", async () => {
			const newMemoData = {
				title: "New Memo",
				description: "New Description",
			};
			const createdMemo = {
				id: "new-memo-id",
				...newMemoData,
				createdAt: Date.now(),
			};

			mockMemosService.createMemo.mockResolvedValue({
				success: true,
				data: createdMemo,
			});
			mockMemosService.getAllMemos
				.mockResolvedValueOnce({
					success: true,
					data: [],
				})
				.mockResolvedValueOnce({
					success: true,
					data: [createdMemo],
				});

			const { result } = renderHook(() => useMemos());

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			let success: boolean;
			await act(async () => {
				success = await result.current.createMemo(newMemoData);
			});

			expect(success!).toBe(true);
			expect(mockMemosService.createMemo).toHaveBeenCalledWith(newMemoData);
			expect(mockMemosService.getAllMemos).toHaveBeenCalledTimes(2);
		});

		test("should handle creation error", async () => {
			const newMemoData = {
				title: "",
				description: "Description",
			};

			mockMemosService.createMemo.mockResolvedValue({
				success: false,
				error: "Title is required",
			});

			const { result } = renderHook(() => useMemos());

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			let success: boolean;
			await act(async () => {
				success = await result.current.createMemo(newMemoData);
			});

			expect(success!).toBe(false);
			await waitFor(() => {
				expect(result.current.error).toBe("Title is required");
			});
			expect(mockMemosService.getAllMemos).toHaveBeenCalledOnce();
		});

		test("should handle unexpected error when creating", async () => {
			const newMemoData = {
				title: "Title",
				description: "Description",
			};

			mockMemosService.createMemo.mockRejectedValue(new Error("Network error"));

			const { result } = renderHook(() => useMemos());

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			let success: boolean;
			await act(async () => {
				success = await result.current.createMemo(newMemoData);
			});

			expect(success!).toBe(false);
			await waitFor(() => {
				expect(result.current.error).toBe(
					"Unexpected error while creating memo",
				);
			});
		});
	});

	describe("updateMemo", () => {
		beforeEach(() => {
			mockMemosService.getAllMemos.mockResolvedValue({
				success: true,
				data: mockMemos,
			});
		});

		test("should successfully update memo", async () => {
			const updateData = { title: "Updated Title" };
			const updatedMemo = {
				...mockMemos[0],
				...updateData,
				updatedAt: Date.now(),
			};

			mockMemosService.updateMemo.mockResolvedValue({
				success: true,
				data: updatedMemo,
			});
			mockMemosService.getAllMemos
				.mockResolvedValueOnce({
					success: true,
					data: mockMemos,
				})
				.mockResolvedValueOnce({
					success: true,
					data: [updatedMemo, mockMemos[1]],
				});

			const { result } = renderHook(() => useMemos());

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			let success: boolean;
			await act(async () => {
				success = await result.current.updateMemo("memo-1", updateData);
			});

			expect(success!).toBe(true);
			expect(mockMemosService.updateMemo).toHaveBeenCalledWith(
				"memo-1",
				updateData,
			);
			expect(mockMemosService.getAllMemos).toHaveBeenCalledTimes(2);
		});

		test("should handle update error", async () => {
			mockMemosService.updateMemo.mockResolvedValue({
				success: false,
				error: "Memo not found",
			});

			const { result } = renderHook(() => useMemos());

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			let success: boolean;
			await act(async () => {
				success = await result.current.updateMemo("non-existent", {
					title: "New Title",
				});
			});

			expect(success!).toBe(false);
			await waitFor(() => {
				expect(result.current.error).toBe("Memo not found");
			});
		});

		test("should handle unexpected error when updating", async () => {
			mockMemosService.updateMemo.mockRejectedValue(new Error("Network error"));

			const { result } = renderHook(() => useMemos());

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			let success: boolean;
			await act(async () => {
				success = await result.current.updateMemo("memo-1", {
					title: "New Title",
				});
			});

			expect(success!).toBe(false);
			await waitFor(() => {
				expect(result.current.error).toBe(
					"Unexpected error while updating memo",
				);
			});
		});
	});

	describe("deleteMemo", () => {
		beforeEach(() => {
			mockMemosService.getAllMemos.mockResolvedValue({
				success: true,
				data: mockMemos,
			});
		});

		test("should successfully delete memo", async () => {
			mockMemosService.deleteMemo.mockResolvedValue({
				success: true,
			});
			mockMemosService.getAllMemos
				.mockResolvedValueOnce({
					success: true,
					data: mockMemos,
				})
				.mockResolvedValueOnce({
					success: true,
					data: [mockMemos[1]],
				});

			const { result } = renderHook(() => useMemos());

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			let success: boolean;
			await act(async () => {
				success = await result.current.deleteMemo("memo-1");
			});

			expect(success!).toBe(true);
			expect(mockMemosService.deleteMemo).toHaveBeenCalledWith("memo-1");
			expect(mockMemosService.getAllMemos).toHaveBeenCalledTimes(2);
		});

		test("should handle deletion error", async () => {
			mockMemosService.deleteMemo.mockResolvedValue({
				success: false,
				error: "Cannot delete memo",
			});

			const { result } = renderHook(() => useMemos());

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			let success: boolean;
			await act(async () => {
				success = await result.current.deleteMemo("memo-1");
			});

			expect(success!).toBe(false);
			await waitFor(() => {
				expect(result.current.error).toBe("Cannot delete memo");
			});
		});

		test("should handle unexpected error when deleting", async () => {
			mockMemosService.deleteMemo.mockRejectedValue(new Error("Network error"));

			const { result } = renderHook(() => useMemos());

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			let success: boolean;
			await act(async () => {
				success = await result.current.deleteMemo("memo-1");
			});

			expect(success!).toBe(false);
			await waitFor(() => {
				expect(result.current.error).toBe(
					"Unexpected error while deleting memo",
				);
			});
		});
	});

	describe("loading states", () => {
		test("should properly manage loading state", async () => {
			let resolvePromise: (value: ServiceResult<Memo[]>) => void = () => {};
			const promise = new Promise<ServiceResult<Memo[]>>((resolve) => {
				resolvePromise = resolve;
			});

			mockMemosService.getAllMemos.mockReturnValue(promise);

			const { result } = renderHook(() => useMemos());

			expect(result.current.loading).toBe(true);

			resolvePromise({
				success: true,
				data: mockMemos,
			});

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});
		});

		test("should clear errors on new operations", async () => {
			mockMemosService.getAllMemos
				.mockResolvedValueOnce({
					success: false,
					error: "Initial error",
				})
				.mockResolvedValueOnce({
					success: true,
					data: mockMemos,
				});

			const { result } = renderHook(() => useMemos());

			await waitFor(() => {
				expect(result.current.error).toBe("Initial error");
			});

			await act(async () => {
				await result.current.refreshMemos();
			});

			await waitFor(() => {
				expect(result.current.error).toBeNull();
				expect(result.current.memos).toEqual(mockMemos);
			});
		});
	});
});
