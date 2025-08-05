import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { buildUrl } from "../features/memos";

export const useNavigation = () => {
  const navigate = useNavigate();

  const goToList = useCallback(() => navigate(buildUrl.list()), [navigate]);
  const goToNew = useCallback(() => navigate(buildUrl.new()), [navigate]);
  const goToView = useCallback((id: string) => navigate(buildUrl.view(id)), [navigate]);
  const goToEdit = useCallback((id: string) => navigate(buildUrl.edit(id)), [navigate]);
  const goBack = useCallback(() => navigate(-1), [navigate]);

  return {
    goToList,
    goToNew,
    goToView,
    goToEdit,
    goBack,
  };
}; 