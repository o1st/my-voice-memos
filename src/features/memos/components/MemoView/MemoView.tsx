import React, { memo } from "react";
import { Button } from "../../../../components/Button/Button";
import { ArrowLeft, Edit2, Trash2 } from "lucide-react";
import type { Memo } from "../../types";

interface MemoViewProps {
  memo: Memo;
  onEdit?: () => void;
  onDelete?: () => void;
  onBack?: () => void;
}

export const MemoView: React.FC<MemoViewProps> = memo(
  ({ memo, onEdit, onDelete, onBack }) => {
    return (
      <div className="w-full max-w-2xl mx-auto flex flex-col gap-6">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button
              variant="ghost"
              onClick={onBack}
              className="p-2 flex-shrink-0"
            >
              <ArrowLeft size={20} />
            </Button>
          )}
          <h2 className="text-xl md:text-2xl font-bold break-words flex-1 text-center md:text-left">
            {memo.title}
          </h2>
          <div className="flex items-center gap-1 flex-shrink-0">
            {onEdit && (
              <Button variant="ghost" onClick={onEdit} className="p-2">
                <Edit2 size={18} />
              </Button>
            )}
            {onDelete && (
              <Button variant="ghost" onClick={onDelete} className="p-2">
                <Trash2 size={18} />
              </Button>
            )}
          </div>
        </div>
        <div className="flex justify-between items-center text-xs text-gray-500 mt-2 pt-2 border-t border-gray-100">
          <div className="text-gray-500 text-xs mb-2">
            {memo.createdAt
              ? `Created: ${new Date(memo.createdAt).toLocaleString()}`
              : null}
          </div>
          <div className="text-gray-500 text-xs mb-2">
            {memo.updatedAt
              ? `Modified: ${new Date(memo.updatedAt).toLocaleString()}`
              : null}
          </div>
        </div>
        <div className="text-base text-gray-800 whitespace-pre-line break-words">
          {memo.description}
        </div>
      </div>
    );
  }
);
