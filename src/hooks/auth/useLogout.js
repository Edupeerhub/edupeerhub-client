import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  handleToastError,
  handleToastSuccess,
} from "../../utils/toastDisplayHandler";
import { logout } from "../../lib/api/auth/authApi";
import { disconnectStreamClients } from "../../lib/stream/streamClientManager";

const useLogout = () => {
  const queryClient = useQueryClient();

  const {
    mutate: logoutMutation,
    isPending,
    error,
  } = useMutation({
    mutationFn: logout,
    onSuccess: async () => {
      await disconnectStreamClients();
      queryClient.removeQueries({ queryKey: ["streamToken"] });
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      handleToastSuccess("Logout successful! See you next time!");
    },
    onError: (error) => {
      handleToastError(error);
    },
  });

  return { logoutMutation, isPending, error };
};
export default useLogout;
