import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { MemoForm } from "../../components/MemoForm/MemoForm";
import { useNavigation } from "../../../../hooks/useNavigation";

const mockMemo = {
  id: "1",
  title: "Example memo",
  description: "This is an example memo description.",
  createdAt: Date.now(),
};

const MemoEditPage: React.FC = () => {
  const { id } = useParams();
  const navigation = useNavigation();

  // TODO: replace with real fetch
  const memo = mockMemo;

  useEffect(() => {
    if (!id) {
      navigation.goToList();
    }
  }, [id, navigation]);

  const handleSave = (data: any) => {
    // TODO: save changes
    alert("Memo updated!");
    navigation.goToView(memo.id);
  };

  return (
    <div className="w-full max-w-2xl mx-auto box-border">
      <div className="px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit memo</h1>
        <p className="text-gray-600 mb-4">
          You can modify the memo using keyboard or speech input.
        </p>
        <MemoForm defaultValues={memo} isEdit onSubmit={handleSave} />
      </div>
    </div>
  );
};

export default MemoEditPage;
