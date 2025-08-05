import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { MemoForm } from "../../components/MemoForm/MemoForm";
import { useNavigation } from "../../../../hooks/useNavigation";
import { useMemo } from "../../hooks";
import { DataStateWrapper } from "../../../../components/DataStateWrapper/DataStateWrapper";

const MemoEditPage: React.FC = () => {
  const { id } = useParams();
  const navigation = useNavigation();
  const { memo, loading, error, updateMemo } = useMemo(id);

  useEffect(() => {
    if (!id) {
      navigation.goToList();
    }
  }, [id, navigation]);

  const handleSave = async (data: any) => {
    if (!memo) return;

    const success = await updateMemo({
      title: data.title.trim(),
      description: data.description.trim(),
    });

    if (success) {
      navigation.goToView(memo.id);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto box-border">
      <div className="px-4">
        <DataStateWrapper
          loading={loading}
          error={error || (!memo ? 'Memo not found' : null)}
          loadingClassName="flex justify-center items-center py-8"
          errorClassName="text-center py-8"
          errorAction={{
            label: "Back to list",
            onClick: () => navigation.goToList(),
          }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit memo</h1>
          <p className="text-gray-600 mb-4">
            You can modify the memo using keyboard or speech input.
          </p>
          {memo && (
            <MemoForm 
              defaultValues={memo} 
              isEdit 
              onSubmit={handleSave} 
            />
          )}
        </DataStateWrapper>
      </div>
    </div>
  );
};

export default MemoEditPage;
