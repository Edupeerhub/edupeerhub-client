import { useQuery } from "@tanstack/react-query";
import { getAuthUser } from "../../lib/api/auth/authApi";

const useAuthUser = () => {
  const authUser = useQuery({
    queryKey: ["authUser"],
    queryFn: getAuthUser,
    retry: false,
  });
  return { isLoading: authUser.isLoading, authUser: authUser.data };
};

export default useAuthUser;
