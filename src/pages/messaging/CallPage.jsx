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
          // Track session_started event
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
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const completedRef = useRef(false); // prevent duplicate tracking

  // Track call start
  useEffect(() => {
    if (callingState === CallingState.JOINED && !startTimeRef.current) {
      startTimeRef.current = new Date();
    }
  }, [callingState, startTimeRef]);

  // Track call end & duration
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

        // Navigate based on role
        if (authUser.role === "student") navigate("/student");
        else if (authUser.role === "tutor") navigate("/tutor");
        else navigate("/");
      }
    };

    handleCallEnd();
  }, [callingState, authUser, call, navigate]);

  return (
    <StreamTheme>
      <SpeakerLayout />
      <CallControls />
    </StreamTheme>
  );
};

export default CallPage;
