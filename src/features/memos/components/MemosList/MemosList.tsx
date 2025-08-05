import React, { memo } from "react";
import type { Memo } from "../../types";
import { MemoCard } from "../MemoCard";

interface MemosListProps {
  memos: Memo[];
  onMemoClick: (id: string) => void;
}

export const MemosList: React.FC<MemosListProps> = memo(({ memos, onMemoClick }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">
          Total memos: {memos.length}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {memos.map((memo) => (
          <MemoCard key={memo.id} memo={memo} onClick={onMemoClick} />
        ))}
      </div>
    </div>
  );
});
