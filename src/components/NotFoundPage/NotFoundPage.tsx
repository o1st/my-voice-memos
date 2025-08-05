import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../Button/Button";
import { buildUrl } from "../../features/memos";

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate(buildUrl.list());
  };

  return (
    <div className="flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Page not found
        </h2>
        <p className="text-gray-600 mb-8">
          The requested page does not exist or has been moved.
        </p>
        <Button onClick={handleGoHome}>Back to memos</Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
