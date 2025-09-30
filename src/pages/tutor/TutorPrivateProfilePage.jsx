import { useTutorProfile } from "../../hooks/tutor/useTutorProfile";
import RatingSummary from "../../components/common/RatingSummary";
import ReviewList from "../../components/common/ReviewList";
import BackButton from "../../components/common/BackButton";
import Spinner from "../../components/common/Spinner";
import useAuthUser from "../../hooks/auth/useAuthUser";

const TutorPrivateProfilePage = () => {
  const { authUser } = useAuthUser();
  const id = authUser?.id;

  const {
    profile,
    reviews,
    reviewSummary,
    isLoading,
    error,
    isLoadingProfileQuery,
    isLoadingReviewSummaryQuery,
    isLoadingReviewsQuery,
    errorProfileQuery,
    errorReviewSummaryQuery,
    errorReviewsQuery,
  } = useTutorProfile(id);

  return (
    <div className="w-full overflow-x-hidden">
      <div className="px-4 sm:px-8 py-4">
        <BackButton to="/tutor/dashboard" />
      </div>

      <div className="px-2 sm:px-8 md:pb-8">
        {/* Tutor Header */}
        {isLoadingProfileQuery ? (
          <Spinner />
        ) : errorProfileQuery ? (
          <p className="text-red-500">Failed to load tutor profile.</p>
        ) : (
          <div className="flex flex-col md:flex-row gap-1 sm:gap-6 items-center">
            <div className="avatar avatar-online shrink-0 self-center">
              <div className="w-20 sm:w-24 rounded-full">
                <img
                  src={profile?.user.profileImageUrl}
                  alt={`${profile?.user.firstName} ${profile?.user.lastName}`}
                  className="w-auto sm:w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="flex-1 min-w-0 sm:w-full w-auto text-center sm:text-left">
              <h1 className="font-bold text-xl sm:text-2xl break-words">
                {profile?.user.firstName} {profile?.user.lastName}
              </h1>

              <div className="mt-2">
                <p className="text-sm text-primary font-semibold break-words">
                  {profile?.subjects?.map((s) => s.name).join(" · ")}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* About */}
        <div className="mt-6">
          <h2 className="font-bold text-lg">About Me</h2>
          <p className="text-sm mt-2 text-gray-500 leading-relaxed break-words">
            {profile?.bio || "No bio"}
          </p>
        </div>

        {/* Rating */}
        <div className="mt-3 md:mt-6">
          {isLoadingReviewSummaryQuery ? (
            <Spinner />
          ) : errorReviewSummaryQuery ? (
            <p className="text-red-500">Failed to load tutor ratings.</p>
          ) : (
            <RatingSummary rating={reviewSummary} />
          )}
        </div>

        {/* Reviews */}
        <div className="mt-6">
          <h2 className="font-bold text-lg mb-4">Reviews</h2>
          {isLoadingReviewsQuery ? (
            <Spinner />
          ) : errorReviewsQuery ? (
            <p className="text-red-500">Failed to load tutor reviews.</p>
          ) : (
            <ReviewList reviews={reviews} />
          )}
        </div>
      </div>
    </div>
  );
};

export default TutorPrivateProfilePage;
