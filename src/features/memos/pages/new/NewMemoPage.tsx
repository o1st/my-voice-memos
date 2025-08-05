import React from "react";
import { MemoForm } from "../../components/MemoForm/MemoForm";

const NewMemoPage: React.FC = () => {
  const handleCreate = (data: any) => {
    const newMemo = {
      id: Date.now().toString(),
      title: data.title.trim(),
      description: data.description.trim(),
      createdAt: Date.now(),
    };
    console.log("New memo created:", newMemo);
    alert("Memo created successfully!");
  };

  return (
    <div className="w-full max-w-2xl mx-auto box-border">
      <div className="px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create memo</h1>
        <p className="text-gray-600 mb-4">
          You can use keyboard or speech input to create a new memo.
        </p>
        <MemoForm onSubmit={handleCreate} />
      </div>
    </div>
  );
};

export default NewMemoPage;
