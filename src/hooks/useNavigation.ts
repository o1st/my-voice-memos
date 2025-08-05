import { useNavigate } from "react-router-dom";
import { buildUrl } from "../features/memos/routes-config";

export const useNavigation = () => {
  const navigate = useNavigate();

  return {
    goToList: () => navigate(buildUrl.list()),
    goToNew: () => navigate(buildUrl.new()),
    goToView: (id: string) => navigate(buildUrl.view(id)),
    goToEdit: (id: string) => navigate(buildUrl.edit(id)),
    
    goBack: () => navigate(-1),
  };
}; 