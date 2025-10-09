import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  StreamVideo,
  StreamCall,
  CallControls,
  SpeakerLayout,
  StreamTheme,
  CallingState,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import "./stream.css";
import PageLoader from "../../components/common/PageLoader";
import FeedbackModal from "../../components/messaging/FeedbackModal";
import { handleToastError } from "../../utils/toastDisplayHandler";
import { fetchBookingById } from "../../lib/api/common/bookingApi";
import { useAuth } from "../../hooks/useAuthContext";
import useCreateReview from "../../hooks/review/useCreateReview";
import useCallAccess from "../../hooks/booking/useCallAccess";
import {
  trackSessionCompleted,
  trackSessionStart,
} from "../../lib/api/analytics/trackEventApi";
import { useStreamContext } from "../../hooks/messaging/useStreamContext";

const CallPage = () => {
  const { id: bookingId } = useParams();
  const { authUser } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const startTimeRef = useRef(null);

  const { videoClient, isReady } = useStreamContext();

  const [call, setCall] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const { data: bookingData, isLoading: isBookingLoading } = useQuery({
    queryKey: ["booking", bookingId],
    queryFn: () => fetchBookingById(bookingId),
    enabled: !!bookingId,
  });

  const { canAccess, reason, dashboardLink } = useCallAccess(bookingData);

  useEffect(() => {
    if (!isReady || !videoClient || !authUser || !bookingId || !canAccess)
      return;

    const callInstance = videoClient.call("default", bookingId);
    let joined = false;

    const joinCall = async () => {
      try {
        setIsConnecting(true);
        await callInstance.join({ create: true });
        joined = true;

        await trackSessionStart({
          sessionId: callInstance.id,
          studentId: authUser.role === "student" ? authUser.id : null,
          tutorId: authUser.role === "tutor" ? authUser.id : null,
        });

        setCall(callInstance);
      } catch (error) {
        console.error("Error joining call:", error);
        handleToastError(error, "Could not join the call.");
      } finally {
        setIsConnecting(false);
      }
    };

    joinCall();

    return () => {
      const startTimeSnapshot = startTimeRef.current;

      (async () => {
        try {
          // Leave the call gracefully on navigation
          if (
            joined &&
            callInstance.state?.callingState !== CallingState.LEFT
          ) {
            await callInstance.leave();
          }

          // Only mark completed if call actually started
          if (startTimeSnapshot) {
            const now = new Date();
            const durationMs = now - startTimeSnapshot;
            const minDurationMs = 10 * 1000; // 10s buffer

            if (durationMs >= minDurationMs) {
              await trackSessionCompleted({
                sessionId: callInstance.id,
                studentId: authUser.role === "student" ? authUser.id : null,
                tutorId: authUser.role === "tutor" ? authUser.id : null,
                startedAt: startTimeSnapshot,
              });

              // small buffer to let analytics & server updates finish
              await new Promise((res) => setTimeout(res, 1500));

              queryClient.invalidateQueries(["booking", bookingId]);
            } else {
              console.log("Skipped completion — call too short (<10s).");
            }
          }
        } catch (err) {
          if (!err.message?.includes("already been left")) {
            console.error("Cleanup error on unmount:", err);
          }
        }
      })();
    };
  }, [isReady, videoClient, authUser?.id, bookingId, canAccess]);

  if (isBookingLoading || isConnecting) return <PageLoader />;

  if (!canAccess) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-100 p-4">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
        <p className="text-lg text-gray-800 mb-6 text-center">{reason}</p>
        <Link
          to={dashboardLink}
          className="bg-primary text-white px-6 py-3 rounded-full font-semibold transition-colors hover:bg-primary-focus"
        >
          Go to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      {videoClient && call && bookingData ? (
        <StreamVideo client={videoClient}>
          <StreamTheme className="light">
            {" "}
            {/* or className="my-light-theme" */}
            <StreamCall call={call}>
              <CallContent
                call={call}
                authUser={authUser}
                navigate={navigate}
                startTimeRef={startTimeRef}
                bookingData={bookingData}
                queryClient={queryClient}
              />
            </StreamCall>
          </StreamTheme>
        </StreamVideo>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p>Could not initialize call. Please refresh or try again later.</p>
        </div>
      )}
    </div>
  );
};

const CallContent = ({
  call,
  authUser,
  navigate,
  startTimeRef,
  bookingData,
  queryClient,
}) => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const completedRef = useRef(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const { createReviewMutation, isCreatingReview } = useCreateReview();

  const storedReviewee =
    authUser.role === "student"
      ? bookingData?.tutor?.user
      : bookingData?.student?.user;

  const handleNavigate = () => {
    navigate(authUser.role === "student" ? "/student" : "/tutor");
  };

  const handleCloseModal = () => {
    setShowFeedbackModal(false);
    handleNavigate();
  };

  const handleSubmitFeedback = (feedback) => {
    if (!storedReviewee) {
      console.warn("No reviewee found, skipping review");
      handleCloseModal();
      return;
    }

    createReviewMutation(
      {
        ...feedback,
        revieweeId: storedReviewee?.id,
        sessionId: call.id,
        type:
          authUser.role === "student" ? "student_to_tutor" : "tutor_to_student",
      },
      { onSettled: handleCloseModal }
    );
  };

  useEffect(() => {
    if (callingState === CallingState.JOINED && !startTimeRef.current) {
      startTimeRef.current = new Date();
    }
  }, [callingState, startTimeRef]);

  useEffect(() => {
    if (
      callingState === CallingState.LEFT &&
      startTimeRef.current &&
      !completedRef.current
    ) {
      completedRef.current = true;
      (async () => {
        const now = new Date();
        const durationMs = now - startTimeRef.current;
        const minDurationMs = 10 * 1000;

        if (durationMs < minDurationMs) {
          console.log("Skipping completion – call too short (<10s)");
          return;
        }

        try {
          await trackSessionCompleted({
            sessionId: call.id,
            studentId: authUser.role === "student" ? authUser.id : null,
            tutorId: authUser.role === "tutor" ? authUser.id : null,
            startedAt: startTimeRef.current,
          });
          await new Promise((res) => setTimeout(res, 1500));
          await queryClient.invalidateQueries(["booking", call.id]);
        } catch (err) {
          console.error("Failed to track session completion:", err);
        }

        setShowFeedbackModal(true);
      })();
    }
  }, [callingState, authUser, call]);

  return (
    <StreamTheme className="light">
      <SpeakerLayout />
      <CallControls
        onLeave={async () => {
          try {
            await call.leave();
          } catch (err) {
            if (!err.message.includes("already been left")) {
              console.error("Call leave error:", err);
            }
          }
        }}
      />
      {showFeedbackModal && (
        <FeedbackModal
          isOpen={showFeedbackModal}
          onClose={handleCloseModal}
          onSubmit={handleSubmitFeedback}
          revieweeName={storedReviewee?.name || "the other participant"}
          isSubmitting={isCreatingReview}
        />
      )}
    </StreamTheme>
  );
};

export default CallPage;
