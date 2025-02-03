import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

export const useAuth = () => {
  const { user, token, isLoading, error } = useSelector(
    (state: RootState) => state.auth
  );

  return {
    user,
    token,
    isLoading,
    error,
    isAuthenticated: !!token && !!user,
  };
};
