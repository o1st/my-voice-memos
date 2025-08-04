import React from "react";
import { NewMemo } from "../../components/NewMemo";

const NewMemoPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-6">Create New Memo</h1>
      <NewMemo />
    </div>
  );
};

export default NewMemoPage;
