import React, { useCallback } from "react";
import { Logo } from "../Logo/Logo";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../Button/Button";
import { ROUTES } from "../../features/memos";

export const Header: React.FC = () => {
  const navigate = useNavigate();

  const handleAddNewClick = useCallback(() => {
    navigate(ROUTES.NEW);
  }, [navigate]);

  return (
    <header className="px-4 pt-2 pb-2 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <Link
          to={ROUTES.LIST}
          style={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
          }}
        >
          <Logo />
        </Link>
        <Button onClick={handleAddNewClick}>Add new</Button>
      </div>
    </header>
  );
};
