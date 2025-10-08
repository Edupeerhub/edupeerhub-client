import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getStreamToken } from "../../lib/api/common/getStreamApi";
import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  CallControls,
  SpeakerLayout,
  StreamTheme,
  CallingState,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import PageLoader from "../../components/common/PageLoader";
import { handleToastError } from "../../utils/toastDisplayHandler";
import {
  trackSessionCompleted,
  trackSessionStart,
} from "../../lib/api/analytics/trackEventApi";
import FeedbackModal from "../../components/messaging/FeedbackModal";
import useCreateReview from "../../hooks/review/useCreateReview";
import { fetchBookingById } from "../../lib/api/common/bookingApi";
import useCallAccess from "../../hooks/booking/useCallAccess";
import { useAuth } from "../../hooks/useAuthContext";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const CallPage = () => {
  const { id: bookingId } = useParams();

  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const { authUser } = useAuth();

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const startTimeRef = useRef(null);

  // fetch stream token
  const { data: tokenData } = useQuery({
    queryKey: ["streamToken", authUser?.id],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  // fetch booking details (contains tutor + student info)
  const { data: bookingData, isLoading: isBookingLoading } = useQuery({
    queryKey: ["booking", bookingId],
    queryFn: () => fetchBookingById(bookingId),
    enabled: !!bookingId,
  });

  // use access control
  const { canAccess, reason, dashboardLink } = useCallAccess(bookingData);

  useEffect(() => {
    if (
      !tokenData?.token ||
      !authUser ||
      !bookingId ||
      !bookingData ||
      !canAccess
    )
      return;

    const user = {
      id: authUser.id,
      name: `${authUser.firstName} ${authUser.lastName}`,
      image: authUser.profileImageUrl,
    };

    const videoClient = StreamVideoClient.getOrCreateInstance({
      apiKey: STREAM_API_KEY,
      user,
      token: tokenData.token,
    });

    const callInstance = videoClient.call("default", bookingId);

    const initCall = async () => {
      try {
        setIsConnecting(true);

        await callInstance.join({ create: true });

        await trackSessionStart({
          sessionId: callInstance.id,
          studentId: authUser.role === "student" ? authUser.id : null,
          tutorId: authUser.role === "tutor" ? authUser.id : null,
        });

        setClient(videoClient);
        setCall(callInstance);
      } catch (error) {
        console.error("Error joining call:", error);
        handleToastError(error, "Could not join the call. Please try again.");
      } finally {
        setIsConnecting(false);
      }
    };

    initCall();

    // ✅ cleanup for unmount / browser close
    return () => {
      const startTimeSnapshot = startTimeRef.current;

      (async () => {
        try {
          // Gracefully leave if still joined
          if (callInstance.state?.callingState !== CallingState.LEFT) {
            await callInstance.leave();
          }

          // ✅ Only mark completed if session actually started
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
              await new Promise((res) => setTimeout(res, 1500));
              queryClient.invalidateQueries(["booking", bookingId]);
            } else {
              console.log("Skipped completion — call too short (<10s).");
            }
          }

          // ✅ Disconnect Stream client safely
          await videoClient.disconnectUser?.();
        } catch (err) {
          if (!err.message?.includes("already been left")) {
            console.error("Cleanup error on unmount:", err);
          }
        }
      })();
    };
  }, [tokenData, authUser, bookingId, bookingData, canAccess]);

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
      {client && call && bookingData ? (
        <StreamVideo client={client}>
          <StreamCall call={call}>
            <CallContent
              call={call}
              authUser={authUser}
              navigate={navigate}
              startTimeRef={startTimeRef}
              bookingData={bookingData}
            />
          </StreamCall>
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
}) => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const completedRef = useRef(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const { createReviewMutation, isCreatingReview } = useCreateReview();
  const queryClient = useQueryClient();

  // Determine reviewee
  const storedReviewee =
    authUser.role === "student"
      ? bookingData?.tutor?.user
      : bookingData?.student?.user;

  const handleNavigate = () => {
    if (authUser.role === "student") navigate("/student");
    else if (authUser.role === "tutor") navigate("/tutor");
    else navigate("/");
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

  // Track call start
  useEffect(() => {
    if (callingState === CallingState.JOINED && !startTimeRef.current) {
      startTimeRef.current = new Date();
    }
  }, [callingState, startTimeRef]);

  // Track call end
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
        const minDurationMs = 10 * 1000; // 10-second buffer

        if (durationMs < minDurationMs) {
          console.log("Skipping session completion – too short (<10s)");
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
    <StreamTheme>
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
