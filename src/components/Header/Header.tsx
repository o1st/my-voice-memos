import React, { useCallback, useMemo } from "react";
import { Logo } from "../Logo/Logo";
import { Link } from "react-router-dom";
import { Button } from "../Button/Button";
import { useNavigation } from "@hooks/useNavigation";
import { buildUrl } from "@features/memos";

export const Header: React.FC = () => {
  const navigation = useNavigation();

  const memoListUrl = useMemo(() => buildUrl.list(), []);

  const handleAddNewClick = useCallback(() => {
    navigation.goToNew();
  }, [navigation]);

  return (
    <header className="px-4 pt-2 pb-2 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <Link
          to={memoListUrl}
          className="flex items-center no-underline"
        >
          <Logo />
        </Link>
        <Button onClick={handleAddNewClick}>Add new</Button>
      </div>
    </header>
  );
};
