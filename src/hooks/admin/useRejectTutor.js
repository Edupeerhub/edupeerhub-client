import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rejectTutor } from "../../lib/api/admin/admin";
import { handleToastError, handleToastSuccess } from "../../utils/toastDisplayHandler";
import { PENDING_TUTORS_QUERY_KEY } from "./usePendingTutors";
import { USER_COUNTS_QUERY_KEY } from "./useUserCounts";
import { USERS_QUERY_KEY } from "./useUsers";
import { buildTutorQueryKey } from "./useTutor";
import { buildAdminUserQueryKey } from "./useAdminUser";

export function useRejectTutor(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tutorId, rejectionReason }) =>
      rejectTutor(tutorId, { rejectionReason }),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: PENDING_TUTORS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
      const tutorId = variables?.tutorId;
      if (tutorId) {
        queryClient.invalidateQueries({
          queryKey: buildTutorQueryKey(tutorId, { isPending: true }),
        });
        queryClient.invalidateQueries({
          queryKey: buildTutorQueryKey(tutorId, { isPending: false }),
        });
        queryClient.invalidateQueries({
          queryKey: buildAdminUserQueryKey(tutorId),
        });
      }
      queryClient.invalidateQueries({ queryKey: USER_COUNTS_QUERY_KEY });
      handleToastSuccess("Tutor rejected successfully.");
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      handleToastError(error, "Failed to reject tutor.");
      options?.onError?.(error, variables, context);
    },
  });
}
