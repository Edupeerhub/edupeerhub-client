import { useQuery } from "@tanstack/react-query";
import {
  getTutorProfile,
  getTutorReviews,
  getTutorReviewSummary,
} from "../../lib/api/tutor/tutorApi";

export function useTutorProfile(id) {
  const profileQuery = useQuery({
    queryKey: ["tutorProfile", id],
    queryFn: () => getTutorProfile(id),
    enabled: !!id,
  });

  const reviewsQuery = useQuery({
    queryKey: ["tutorReviews", id],
    queryFn: () => getTutorReviews(id),
    enabled: !!id,
  });

  const reviewSummaryQuery = useQuery({
    queryKey: ["tutorReviewSummary", id],
    queryFn: () => getTutorReviewSummary(id),
    enabled: !!id,
    // initialData: {
    //   totalReviews: 0,
    //   averageRating: null,
    //   breakdown: [5, 4, 3, 2, 1].map((stars) => ({ stars, percent: 0 })),
    // },
  });

  return {
    profile: profileQuery.data,
    reviews: reviewsQuery.data,
    reviewSummary: reviewSummaryQuery.data,
    isLoadingProfileQuery: profileQuery.isLoading,
    isLoadingReviewsQuery: reviewsQuery.isLoading,
    isLoadingReviewSummaryQuery: reviewSummaryQuery.isLoading,
    isLoading:
      profileQuery.isLoading ||
      reviewsQuery.isLoading ||
      reviewSummaryQuery.isLoading,
    error: profileQuery.error || reviewsQuery.error || reviewSummaryQuery.error,
    errorProfileQuery: profileQuery.error,
    errorReviewsQuery: reviewsQuery.error,
    errorReviewSummaryQuery: reviewSummaryQuery.error,
  };
}
