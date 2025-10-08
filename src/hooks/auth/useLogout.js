import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  handleToastError,
  handleToastSuccess,
} from "../../utils/toastDisplayHandler";
import { logout } from "../../lib/api/auth/authApi";
import useChatClient from "../messaging/useChatClient";
import { useAuth } from "../useAuthContext";

const useLogout = () => {
  const { authUser } = useAuth();
  const queryClient = useQueryClient();
  const { disconnectChatClient } = useChatClient(authUser);

  const {
    mutate: logoutMutation,
    isPending,
    error,
  } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      disconnectChatClient();
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
