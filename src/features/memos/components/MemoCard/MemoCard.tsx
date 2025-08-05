import React, { useCallback, memo } from "react";
import type { Memo } from "../../types";

interface MemoCardProps {
  memo: Memo;
  onClick: (id: string) => void;
}

export const MemoCard: React.FC<MemoCardProps> = memo(({ memo, onClick }) => {
  const handleClick = useCallback(() => {
    onClick(memo.id);
  }, [memo.id, onClick]);

  return (
    <div
      className="w-full h-40 bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-[#F4E869] hover:bg-[#F4E869]/5 flex flex-col justify-between"
      onClick={handleClick}
    >
      <div className="flex-1 min-h-0">
        <h3 className="text-lg font-semibold text-gray-900 hover:text-[#F4E869] transition-colors mb-2 truncate">
          {memo.title}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-3">
          {memo.description}
        </p>
      </div>

      <div className="flex justify-between items-center text-xs text-gray-500 mt-2 pt-2 border-t border-gray-100">
        <span>
          Created: {new Date(memo.createdAt).toLocaleDateString("en-US")}
        </span>
        {memo.updatedAt && (
          <span>
            Updated: {new Date(memo.updatedAt).toLocaleDateString("en-US")}
          </span>
        )}
      </div>
    </div>
  );
});

