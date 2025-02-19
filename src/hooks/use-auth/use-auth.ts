import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

export const useAuth = () => {
  const { user, token, isLoading, error, isSuperUser } = useSelector(
    (state: RootState) => state.auth
  );

  return {
    user,
    token,
    isLoading,
    isSuperUser,
    error,
    isAuthenticated: !!token,
  };
};
