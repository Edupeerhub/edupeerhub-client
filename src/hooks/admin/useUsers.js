import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "../../lib/api/admin/admin";

export const USERS_QUERY_KEY = ["users"];

function buildQueryKey({ role }) {
  if (!role) {
    return USERS_QUERY_KEY;
  }

  return [...USERS_QUERY_KEY, { role }];
}

export function useUsers({ role, enabled = true, ...options } = {}) {
  const queryKey = buildQueryKey({ role });

  return useQuery({
    queryKey,
    queryFn: () => getAllUsers(role),
    enabled,
    ...options,
  });
}
