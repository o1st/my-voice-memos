import React from "react";
import { MemosList } from "../../components/MemosList";
import { useMemos } from "../../hooks";
import { useNavigation } from "@hooks/useNavigation";
import { DataStateWrapper } from "@components/DataStateWrapper/DataStateWrapper";

const MemosListPage: React.FC = () => {
  const { memos, loading, error } = useMemos();
  const navigation = useNavigation();

  const handleView = (id: string) => {
    navigation.goToView(id);
  };

  const handleCreateNew = () => {
    navigation.goToNew();
  };

  return (
    <div className="w-full px-4 md:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Memos</h1>
      </div>
      <DataStateWrapper
        loading={loading}
        error={error}
        emptyState={{
          show: memos.length === 0,
          message: "You don't have any memos yet",
          actionLabel: "Create your first memo",
          onAction: handleCreateNew,
        }}
        errorAction={{
          label: "Create your first memo",
          onClick: handleCreateNew,
        }}
      >
        <MemosList memos={memos} onMemoClick={handleView} />
      </DataStateWrapper>
    </div>
  );
};

export default MemosListPage;
