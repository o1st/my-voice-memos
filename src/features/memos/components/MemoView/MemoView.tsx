import React from "react";
import { Button } from "../../../../components/Button/Button";
import { ArrowLeft, Edit2, Trash2 } from "lucide-react";

interface MemoViewProps {
  memo: {
    id: string;
    title: string;
    description: string;
    createdAt?: number;
  };
  onEdit?: () => void;
  onDelete?: () => void;
  onBack?: () => void;
}

export const MemoView: React.FC<MemoViewProps> = ({
  memo,
  onEdit,
  onDelete,
  onBack,
}) => {
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

      <div className="text-gray-500 text-xs mb-2">
        {memo.createdAt
          ? `Modified: ${new Date(memo.createdAt).toLocaleString()}`
          : null}
      </div>
      <div className="text-base text-gray-800 whitespace-pre-line break-words">
        {memo.description}
      </div>
    </div>
  );
};
