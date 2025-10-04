import useAuthUser from "./useAuthUser";

const useAuthStatus = () => {
  const { authUser } = useAuthUser();
  const isAuthenticated = !!authUser;

  const roleLink =
    authUser?.role === "tutor"
      ? "/tutor"
      : authUser?.role === "student"
      ? "/student"
      : "/admin";

  return { isAuthenticated, roleLink, authUser };
};

export default useAuthStatus;
