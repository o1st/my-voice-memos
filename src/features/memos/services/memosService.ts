import { LocalStorageRepository } from "@shared/repositories";
import type { Repository, ServiceResult } from "@shared/types";
import type { Memo } from "../types";

export class MemosService {
	private repository: Repository<Memo>;

	constructor(repository: Repository<Memo>) {
		this.repository = repository;
	}

	async getAllMemos(): Promise<ServiceResult<Memo[]>> {
		return this.repository.getAll();
	}

	async getMemo(id: string): Promise<ServiceResult<Memo>> {
		if (!id || typeof id !== "string") {
			return {
				success: false,
				error: "Invalid memo ID",
			};
		}

		return this.repository.getById(id);
	}

	async createMemo(memoData: {
		title: string;
		description: string;
	}): Promise<ServiceResult<Memo>> {
		if (!memoData.title || !memoData.title.trim()) {
			return {
				success: false,
				error: "Memo title is required",
			};
		}

		if (!memoData.description || !memoData.description.trim()) {
			return {
				success: false,
				error: "Memo description is required",
			};
		}

		return this.repository.create({
			title: memoData.title.trim(),
			description: memoData.description.trim(),
		});
	}

	async updateMemo(
		id: string,
		updateData: { title?: string; description?: string },
	): Promise<ServiceResult<Memo>> {
		if (!id || typeof id !== "string") {
			return {
				success: false,
				error: "Invalid memo ID",
			};
		}

		const exists = await this.repository.exists(id);
		if (!exists) {
			return {
				success: false,
				error: "Memo not found",
			};
		}

		if (
			updateData.title !== undefined &&
			(!updateData.title || !updateData.title.trim())
		) {
			return {
				success: false,
				error: "Memo title cannot be empty",
			};
		}

		if (
			updateData.description !== undefined &&
			(!updateData.description || !updateData.description.trim())
		) {
			return {
				success: false,
				error: "Memo description cannot be empty",
			};
		}

		return this.repository.update(id, updateData);
	}

	async deleteMemo(id: string): Promise<ServiceResult<void>> {
		if (!id || typeof id !== "string") {
			return {
				success: false,
				error: "Invalid memo ID",
			};
		}

		return this.repository.delete(id);
	}

	async memoExists(id: string): Promise<boolean> {
		if (!id || typeof id !== "string") {
			return false;
		}

		return this.repository.exists(id);
	}
}

export const memosService = new MemosService(
	new LocalStorageRepository<Memo>({
		storageKey: "my-voice-memos",
		version: "1.0.0",
	}),
);
