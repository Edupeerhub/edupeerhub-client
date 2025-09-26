import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
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
import useAuthUser from "../../hooks/auth/useAuthUser";
import {
  trackSessionCompleted,
  trackSessionStart,
} from "../../lib/api/analytics/trackEventApi";
import FeedbackModal from "../../components/messaging/FeedbackModal";
import useCreateReview from "../../hooks/review/useCreateReview";
import { fetchBookingById } from "../../lib/api/common/bookingApi";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const CallPage = () => {
  const { id: bookingId } = useParams();

  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);
  const { authUser } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  // fetch booking details (contains tutor + student info)
  const { data: bookingData } = useQuery({
    queryKey: ["booking", bookingId],
    queryFn: () => fetchBookingById(bookingId),
    enabled: !!bookingId,
  });

  const navigate = useNavigate();
  const startTimeRef = useRef(null);

  useEffect(() => {
    if (!tokenData?.token || !authUser || !bookingId) return;

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
        await callInstance.join({ create: true });

        await trackSessionStart({
          sessionId: callInstance.id,
          studentId: authUser.role === "student" ? authUser.id : null,
          tutorId: authUser.role === "tutor" ? authUser.id : null,
        });

        setClient(videoClient);
        setCall(callInstance);
        setIsConnecting(false);
      } catch (error) {
        console.error("Error joining call:", error);
        handleToastError(error, "Could not join the call. Please try again.");
        setIsConnecting(false);
      }
    };

    initCall();

    // cleanup
    return () => {
      if (callInstance) {
        callInstance.leave().catch((err) => {
          if (!err.message.includes("already been left")) {
            console.error("Error leaving call:", err);
          }
        });
      }
    };
  }, [tokenData, authUser, bookingId]);

  if (isConnecting) return <PageLoader />;

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

  // ✅ Determine reviewee from booking
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
      {
        onSettled: () => {
          handleCloseModal();
        },
      }
    );
  };

  // track start
  useEffect(() => {
    if (callingState === CallingState.JOINED && !startTimeRef.current) {
      startTimeRef.current = new Date();
    }
  }, [callingState, startTimeRef]);

  // track end
  useEffect(() => {
    if (
      callingState === CallingState.LEFT &&
      startTimeRef.current &&
      !completedRef.current
    ) {
      completedRef.current = true;
      (async () => {
        try {
          await trackSessionCompleted({
            sessionId: call.id,
            studentId: authUser.role === "student" ? authUser.id : null,
            tutorId: authUser.role === "tutor" ? authUser.id : null,
            startedAt: startTimeRef.current,
          });
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
