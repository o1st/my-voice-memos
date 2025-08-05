import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { MemoView } from "../../components/MemoView/MemoView";
import { useNavigation } from "../../../../hooks/useNavigation";

const mockMemo = {
  id: "1",
  title: "Example memo",
  description: "This is an example memo description.",
  createdAt: Date.now(),
};

const MemoViewPage: React.FC = () => {
  const { id } = useParams();
  const navigation = useNavigation();

  // TODO: replace
  const memo = mockMemo;

  useEffect(() => {
    if (!id) {
      navigation.goToList();
    }
  }, [id, navigation]);

  const handleEdit = () => {
    navigation.goToEdit(memo.id);
  };

  const handleDelete = () => {
    // TODO: replace
    alert("Memo deleted!");
    navigation.goToList();
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <div className="w-full max-w-2xl mx-auto box-border">
      <div className="px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">View memo</h1>
        <MemoView
          memo={memo}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onBack={handleBack}
        />
      </div>
    </div>
  );
};

export default MemoViewPage;
