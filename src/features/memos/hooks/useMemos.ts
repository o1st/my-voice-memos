import { useState, useEffect, useCallback } from 'react';

import { memosService } from '../services/memosService';
import type { Memo } from '../types';

interface UseMemosState {
  memos: Memo[];
  loading: boolean;
  error: string | null;
}

interface UseMemosReturn extends UseMemosState {
  refreshMemos: () => Promise<void>;
  createMemo: (data: { title: string; description: string }) => Promise<boolean>;
  updateMemo: (id: string, data: { title?: string; description?: string }) => Promise<boolean>;
  deleteMemo: (id: string) => Promise<boolean>;
}

export const useMemos = (): UseMemosReturn => {
  const [state, setState] = useState<UseMemosState>({
    memos: [],
    loading: false,
    error: null
  });

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const setMemos = useCallback((memos: Memo[]) => {
    setState(prev => ({ ...prev, memos }));
  }, []);

  const refreshMemos = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await memosService.getAllMemos();
      
      if (result.success && result.data) {
        setMemos(result.data);
      } else {
        setError(result.error || 'Error loading memos');
      }
    } catch (error) {
      setError('Unexpected error while loading memos');
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setMemos]);

  const createMemo = useCallback(async (data: { title: string; description: string }): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const result = await memosService.createMemo(data);
      
      if (result.success) {
        await refreshMemos();
        return true;
      } else {
        setError(result.error || 'Error creating memo');
        return false;
      }
    } catch (error) {
      setError('Unexpected error while creating memo');
      return false;
    } finally {
      setLoading(false);
    }
  }, [refreshMemos, setLoading, setError]);

  const updateMemo = useCallback(async (
    id: string, 
    data: { title?: string; description?: string }
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const result = await memosService.updateMemo(id, data);
      
      if (result.success) {
        await refreshMemos();
        return true;
      } else {
        setError(result.error || 'Error updating memo');
        return false;
      }
    } catch (error) {
      setError('Unexpected error while updating memo');
      return false;
    } finally {
      setLoading(false);
    }
  }, [refreshMemos, setLoading, setError]);

  const deleteMemo = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const result = await memosService.deleteMemo(id);
      
      if (result.success) {
        await refreshMemos();
        return true;
      } else {
        setError(result.error || 'Error deleting memo');
        return false;
      }
    } catch (error) {
      setError('Unexpected error while deleting memo');
      return false;
    } finally {
      setLoading(false);
    }
  }, [refreshMemos, setLoading, setError]);

  useEffect(() => {
    refreshMemos();
  }, [refreshMemos]);

  return {
    ...state,
    refreshMemos,
    createMemo,
    updateMemo,
    deleteMemo
  };
};