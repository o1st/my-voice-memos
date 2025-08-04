import React from "react";
import { MemosList } from "../../components/MemosList";

const MemosListPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-6">My Memos</h1>
      <MemosList />
    </div>
  );
};

export default MemosListPage;
