import { useQuery } from "@tanstack/react-query";
import { getSubjects } from "../lib/api/common/subjectsApi";

export default function useSubjects() {
  const {
    data: subjects,
    isLoading: subjectLoading,
    error: subjectError,
  } = useQuery({
    queryKey: ["subjects"],
    queryFn: getSubjects,
  });

  return {
    subjects,
    subjectLoading,
    subjectError,
  };
}
