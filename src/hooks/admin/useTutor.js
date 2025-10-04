import { useQuery } from "@tanstack/react-query";
import {
  getPendingTutorById,
  getUserById,
} from "../../lib/api/admin/admin";

export function buildTutorQueryKey(id, { isPending } = {}) {
  return ["tutor", id, isPending ? "pending" : "active"];
}

export function useTutor({ id, isPending = false, enabled = true, ...options }) {
  return useQuery({
    queryKey: buildTutorQueryKey(id, { isPending }),
    queryFn: () => (isPending ? getPendingTutorById(id) : getUserById(id)),
    enabled: Boolean(id) && enabled,
    ...options,
  });
}
