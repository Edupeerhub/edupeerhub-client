import { useQuery } from "@tanstack/react-query";
import { getPendingTutors } from "../../lib/api/admin/admin";

export const PENDING_TUTORS_QUERY_KEY = ["tutors", "pending"];

export function usePendingTutors(options = {}) {
  return useQuery({
    queryKey: PENDING_TUTORS_QUERY_KEY,
    queryFn: getPendingTutors,
    ...options,
  });
}
