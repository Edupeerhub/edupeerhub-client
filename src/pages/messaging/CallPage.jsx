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

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const CallPage = () => {
  const { id: callId } = useParams();
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);
  const { authUser } = useAuthUser();
  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });
  const navigate = useNavigate();
  const startTimeRef = useRef(null);

  useEffect(() => {
    const initCall = async () => {
      if (!tokenData?.token || !authUser || !callId) return;
      try {
        const user = {
          id: authUser.id,
          name: `${authUser.firstName} ${authUser.lastName}`,
          image: authUser.profileImageUrl,
        };
        const videoClient = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          user,
          token: tokenData.token,
        });
        const callInstance = videoClient.call("default", callId);
        await callInstance.join({ create: true });
        try {
          await trackSessionStart({
            sessionId: callInstance.id,
            studentId: authUser.role === "student" ? authUser.id : null,
            tutorId: authUser.role === "tutor" ? authUser.id : null,
          });
        } catch (err) {
          console.error("Failed to track session start:", err);
        }
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
  }, [tokenData, authUser, callId]);

  if (isConnecting) return <PageLoader />;

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      {client && call ? (
        <StreamVideo client={client}>
          <StreamCall call={call}>
            <CallContent
              call={call}
              authUser={authUser}
              navigate={navigate}
              startTimeRef={startTimeRef}
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

const CallContent = ({ call, authUser, navigate, startTimeRef }) => {
  const { useCallCallingState, useCallMembers } = useCallStateHooks();
  const callingState = useCallCallingState();
  const members = useCallMembers();
  const completedRef = useRef(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const { createReviewMutation, isCreatingReview } = useCreateReview();

  const reviewee = members.find((member) => member.user.id !== authUser.id)?.user;

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
    if (!reviewee) return;
    createReviewMutation(
      {
        ...feedback,
        reviewerId: authUser.id,
        revieweeId: reviewee.id,
        sessionId: call.id,
        type: authUser.role === "student" ? "student_to_tutor" : "tutor_to_student",
      },
      {
        onSettled: () => {
          handleCloseModal();
        },
      }
    );
  };

  useEffect(() => {
    if (callingState === CallingState.JOINED && !startTimeRef.current) {
      startTimeRef.current = new Date();
    }
  }, [callingState, startTimeRef]);

  useEffect(() => {
    const handleCallEnd = async () => {
      if (
        callingState === CallingState.LEFT &&
        startTimeRef.current &&
        !completedRef.current
      ) {
        completedRef.current = true;
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
      }
    };
    handleCallEnd();
  }, [callingState, authUser, call]);

  return (
    <StreamTheme>
      <SpeakerLayout />
      <CallControls onLeave={() => call.leave()} />
      {showFeedbackModal && (
        <FeedbackModal
          isOpen={showFeedbackModal}
          onClose={handleCloseModal}
          onSubmit={handleSubmitFeedback}
          revieweeName={reviewee?.name || "the other participant"}
          isSubmitting={isCreatingReview}
        />
      )}
    </StreamTheme>
  );
};

export default CallPage;