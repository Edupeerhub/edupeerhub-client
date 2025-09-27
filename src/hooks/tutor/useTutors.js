import { useQuery } from "@tanstack/react-query";
import { getTutors } from "../../lib/api/tutor/tutorApi";

export const useTutors = (searchQuery, filters) => {
  return useQuery({
    queryKey: ["tutors", searchQuery, filters],
    queryFn: () =>
      getTutors({
        search: searchQuery || undefined,
        subjects: filters.subjects.length ? filters.subjects : undefined,
        availability: filters.availability.length
          ? filters.availability
          : undefined,
        ratings: filters.ratings.length ? filters.ratings : undefined,
      }),
  });
};
