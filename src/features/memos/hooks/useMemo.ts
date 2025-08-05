import { useCallback, useEffect, useState } from "react";

import { memosService } from "../services/memosService";
import type { Memo } from "../types";

interface UseMemoState {
	memo: Memo | null;
	loading: boolean;
	error: string | null;
}

interface UseMemoReturn extends UseMemoState {
	refreshMemo: () => Promise<void>;
	updateMemo: (data: {
		title?: string;
		description?: string;
	}) => Promise<boolean>;
	deleteMemo: () => Promise<boolean>;
}

export const useMemo = (id: string | undefined): UseMemoReturn => {
	const [state, setState] = useState<UseMemoState>({
		memo: null,
		loading: false,
		error: null,
	});

	const setLoading = useCallback((loading: boolean) => {
		setState((prev) => ({ ...prev, loading }));
	}, []);

	const setError = useCallback((error: string | null) => {
		setState((prev) => ({ ...prev, error }));
	}, []);

	const setMemo = useCallback((memo: Memo | null) => {
		setState((prev) => ({ ...prev, memo }));
	}, []);

	const refreshMemo = useCallback(async () => {
		if (!id) {
			setError("Memo ID not specified");
			return;
		}

		setLoading(true);
		setError(null);

		try {
			const result = await memosService.getMemo(id);

			if (result.success && result.data) {
				setMemo(result.data);
			} else {
				setError(result.error || "Memo not found");
				setMemo(null);
			}
		} catch (_error) {
			setError("Unexpected error while loading memo");
			setMemo(null);
		} finally {
			setLoading(false);
		}
	}, [id, setLoading, setError, setMemo]);

	const updateMemo = useCallback(
		async (data: {
			title?: string;
			description?: string;
		}): Promise<boolean> => {
			if (!id) {
				setError("Memo ID not specified");
				return false;
			}

			setLoading(true);
			setError(null);

			try {
				const result = await memosService.updateMemo(id, data);

				if (result.success && result.data) {
					setMemo(result.data);
					return true;
				} else {
					setError(result.error || "Error updating memo");
					return false;
				}
			} catch (_error) {
				setError("Unexpected error while updating memo");
				return false;
			} finally {
				setLoading(false);
			}
		},
		[id, setLoading, setError, setMemo],
	);

	const deleteMemo = useCallback(async (): Promise<boolean> => {
		if (!id) {
			setError("Memo ID not specified");
			return false;
		}

		setLoading(true);
		setError(null);

		try {
			const result = await memosService.deleteMemo(id);

			if (result.success) {
				setMemo(null);
				return true;
			} else {
				setError(result.error || "Error deleting memo");
				return false;
			}
		} catch (_error) {
			setError("Unexpected error while deleting memo");
			return false;
		} finally {
			setLoading(false);
		}
	}, [id, setLoading, setError, setMemo]);

	useEffect(() => {
		if (id) {
			refreshMemo();
		} else {
			setMemo(null);
			setError(null);
		}
	}, [id, refreshMemo, setMemo, setError]);

	return {
		...state,
		refreshMemo,
		updateMemo,
		deleteMemo,
	};
};
