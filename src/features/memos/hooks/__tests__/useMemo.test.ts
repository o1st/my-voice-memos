import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import type { Memo } from "../../types";
import { useMemo } from "../useMemo";

vi.mock("../../services/memosService", () => ({
	memosService: {
		getMemo: vi.fn(),
		updateMemo: vi.fn(),
		deleteMemo: vi.fn(),
	},
}));

import { memosService } from "../../services/memosService";

const mockMemosService = vi.mocked(memosService);

describe("useMemo", () => {
	const mockMemo: Memo = {
		id: "test-memo-1",
		title: "Test Memo",
		description: "Test Description",
		createdAt: Date.now(),
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("initialization", () => {
		test("should set initial values for undefined ID", () => {
			const { result } = renderHook(() => useMemo(undefined));

			expect(result.current.memo).toBeNull();
			expect(result.current.loading).toBe(false);
			expect(result.current.error).toBeNull();
		});

		test("should start loading for valid ID", async () => {
			mockMemosService.getMemo.mockResolvedValue({
				success: true,
				data: mockMemo,
			});

			const { result } = renderHook(() => useMemo("test-memo-1"));

			expect(result.current.loading).toBe(true);

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			expect(result.current.memo).toEqual(mockMemo);
			expect(result.current.error).toBeNull();
		});
	});

	describe("refreshMemo", () => {
		test("should successfully load memo", async () => {
			mockMemosService.getMemo.mockResolvedValue({
				success: true,
				data: mockMemo,
			});

			const { result } = renderHook(() => useMemo("test-memo-1"));

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			expect(mockMemosService.getMemo).toHaveBeenCalledWith("test-memo-1");
			expect(result.current.memo).toEqual(mockMemo);
			expect(result.current.error).toBeNull();
		});

		test("should handle service error", async () => {
			mockMemosService.getMemo.mockResolvedValue({
				success: false,
				error: "Memo not found",
			});

			const { result } = renderHook(() => useMemo("non-existent"));

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			expect(result.current.memo).toBeNull();
			expect(result.current.error).toBe("Memo not found");
		});

		test("should handle unexpected error", async () => {
			mockMemosService.getMemo.mockRejectedValue(new Error("Network error"));

			const { result } = renderHook(() => useMemo("test-memo-1"));

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			expect(result.current.memo).toBeNull();
			expect(result.current.error).toBe("Unexpected error while loading memo");
		});

		test("should return error for undefined ID", async () => {
			const { result } = renderHook(() => useMemo(undefined));

			await act(async () => {
				await result.current.refreshMemo();
			});

			await waitFor(() => {
				expect(result.current.error).toBe("Memo ID not specified");
			});
			expect(mockMemosService.getMemo).not.toHaveBeenCalled();
		});
	});

	describe("updateMemo", () => {
		beforeEach(() => {
			mockMemosService.getMemo.mockResolvedValue({
				success: true,
				data: mockMemo,
			});
		});

		test("should successfully update memo", async () => {
			const updatedMemo = { ...mockMemo, title: "Updated Title" };
			mockMemosService.updateMemo.mockResolvedValue({
				success: true,
				data: updatedMemo,
			});

			const { result } = renderHook(() => useMemo("test-memo-1"));

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			let success: boolean;
			await act(async () => {
				success = await result.current.updateMemo({ title: "Updated Title" });
			});

			expect(success!).toBe(true);
			expect(mockMemosService.updateMemo).toHaveBeenCalledWith("test-memo-1", {
				title: "Updated Title",
			});

			await waitFor(() => {
				expect(result.current.memo).toEqual(updatedMemo);
				expect(result.current.error).toBeNull();
			});
		});

		test("should handle update error", async () => {
			mockMemosService.updateMemo.mockResolvedValue({
				success: false,
				error: "Validation error",
			});

			const { result } = renderHook(() => useMemo("test-memo-1"));

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			let success: boolean;
			await act(async () => {
				success = await result.current.updateMemo({ title: "" });
			});

			expect(success!).toBe(false);
			await waitFor(() => {
				expect(result.current.error).toBe("Validation error");
			});
		});

		test("should handle unexpected error when updating", async () => {
			mockMemosService.updateMemo.mockRejectedValue(new Error("Network error"));

			const { result } = renderHook(() => useMemo("test-memo-1"));

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			let success: boolean;
			await act(async () => {
				success = await result.current.updateMemo({ title: "New Title" });
			});

			expect(success!).toBe(false);
			await waitFor(() => {
				expect(result.current.error).toBe(
					"Unexpected error while updating memo",
				);
			});
		});

		test("should return false for undefined ID", async () => {
			const { result } = renderHook(() => useMemo(undefined));

			let success: boolean;
			await act(async () => {
				success = await result.current.updateMemo({ title: "Test" });
			});

			expect(success!).toBe(false);
			await waitFor(() => {
				expect(result.current.error).toBe("Memo ID not specified");
			});
			expect(mockMemosService.updateMemo).not.toHaveBeenCalled();
		});
	});

	describe("deleteMemo", () => {
		beforeEach(() => {
			mockMemosService.getMemo.mockResolvedValue({
				success: true,
				data: mockMemo,
			});
		});

		test("should successfully delete memo", async () => {
			mockMemosService.deleteMemo.mockResolvedValue({
				success: true,
			});

			const { result } = renderHook(() => useMemo("test-memo-1"));

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			let success: boolean;
			await act(async () => {
				success = await result.current.deleteMemo();
			});

			expect(success!).toBe(true);
			expect(mockMemosService.deleteMemo).toHaveBeenCalledWith("test-memo-1");

			await waitFor(() => {
				expect(result.current.memo).toBeNull();
				expect(result.current.error).toBeNull();
			});
		});

		test("should handle deletion error", async () => {
			mockMemosService.deleteMemo.mockResolvedValue({
				success: false,
				error: "Cannot delete memo",
			});

			const { result } = renderHook(() => useMemo("test-memo-1"));

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			let success: boolean;
			await act(async () => {
				success = await result.current.deleteMemo();
			});

			expect(success!).toBe(false);
			await waitFor(() => {
				expect(result.current.error).toBe("Cannot delete memo");
			});
		});

		test("should handle unexpected error when deleting", async () => {
			mockMemosService.deleteMemo.mockRejectedValue(new Error("Network error"));

			const { result } = renderHook(() => useMemo("test-memo-1"));

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			let success: boolean;
			await act(async () => {
				success = await result.current.deleteMemo();
			});

			expect(success!).toBe(false);
			await waitFor(() => {
				expect(result.current.error).toBe(
					"Unexpected error while deleting memo",
				);
			});
		});

		test("should return false for undefined ID", async () => {
			const { result } = renderHook(() => useMemo(undefined));

			let success: boolean;
			await act(async () => {
				success = await result.current.deleteMemo();
			});

			expect(success!).toBe(false);
			await waitFor(() => {
				expect(result.current.error).toBe("Memo ID not specified");
			});
			expect(mockMemosService.deleteMemo).not.toHaveBeenCalled();
		});
	});

	describe("reactivity to ID changes", () => {
		test("should reload data when ID changes", async () => {
			mockMemosService.getMemo
				.mockResolvedValueOnce({
					success: true,
					data: { ...mockMemo, id: "memo-1" },
				})
				.mockResolvedValueOnce({
					success: true,
					data: { ...mockMemo, id: "memo-2", title: "Second Memo" },
				});

			const { result, rerender } = renderHook(({ id }) => useMemo(id), {
				initialProps: { id: "memo-1" },
			});

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			expect(result.current.memo?.id).toBe("memo-1");

			rerender({ id: "memo-2" });

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			expect(result.current.memo?.id).toBe("memo-2");
			expect(result.current.memo?.title).toBe("Second Memo");
		});

		test("should clear data when changing to undefined ID", async () => {
			mockMemosService.getMemo.mockResolvedValue({
				success: true,
				data: mockMemo,
			});

			const { result, rerender } = renderHook(({ id }) => useMemo(id), {
				initialProps: { id: "memo-1" },
			});

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			expect(result.current.memo).toEqual(mockMemo);

			rerender({ id: undefined as unknown as string });

			expect(result.current.memo).toBeNull();
			expect(result.current.error).toBeNull();
		});
	});
});
