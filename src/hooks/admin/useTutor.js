import { useQuery } from "@tanstack/react-query";
import {
  getPendingTutorById,
  getUserById,
} from "../../lib/api/admin/admin";

export function buildTutorQueryKey(id, { isPending } = {}) {
  return ["tutor", id, isPending ? "pending" : "active"];
}

const normalizeActiveTutor = (data) => {
  if (!data) return data;

  return {
    ...data,
    tutor: data.tutor ?? null,
    subjects: Array.isArray(data.tutor?.subjects)
      ? data.tutor.subjects
      : Array.isArray(data.subjects)
      ? data.subjects
      : [],
    raw: data,
  };
};

const normalizePendingTutor = (data) => {
  if (!data) return data;

  const user = data.user ?? {};
  const id = data.userId ?? user.id ?? data.id;

  return {
    ...user,
    id,
    tutor: {
      ...data,
      user,
    },
    subjects: Array.isArray(data.subjects) ? data.subjects : [],
    user,
    raw: data,
  };
};

export function useTutor({ id, isPending = false, enabled = true, ...options }) {
  const { select: customSelect, ...rest } = options;

  return useQuery({
    queryKey: buildTutorQueryKey(id, { isPending }),
    queryFn: () => (isPending ? getPendingTutorById(id) : getUserById(id)),
    enabled: Boolean(id) && enabled,
    select:
      customSelect ??
      ((data) => (isPending ? normalizePendingTutor(data) : normalizeActiveTutor(data))),
    ...rest,
  });
}
