import { useQuery } from "@tanstack/react-query";
import { getTutorDocumentUrl } from "../../lib/api/admin/admin";

function buildTutorDocumentKey(id) {
  return ["tutor", id, "document"];
}

export function useTutorDocument({ id, enabled = true, ...options }) {
  return useQuery({
    queryKey: buildTutorDocumentKey(id),
    queryFn: () => getTutorDocumentUrl(id),
    enabled: Boolean(id) && enabled,
    ...options,
  });
}
