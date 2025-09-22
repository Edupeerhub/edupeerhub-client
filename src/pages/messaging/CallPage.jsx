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
import trackEvent from "../../lib/api/analytics/trackEventApi"; // your backend API

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

        // Track session_started event
        await trackEvent("session_started", {
          session_id: callInstance.id,
          user_id: authUser.id,
          tutor_id: authUser.role === "tutor" ? authUser.id : null,
          started_at: new Date().toISOString(),
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

  // Track call start
  useEffect(() => {
    if (callingState === CallingState.CALLING && !startTimeRef.current) {
      startTimeRef.current = new Date();
    }
  }, [callingState, startTimeRef]);

  // Track call end & duration
  useEffect(() => {
    const handleCallEnd = async () => {
      if (callingState === CallingState.LEFT && startTimeRef.current) {
        const endTime = new Date();
        const durationSecs = Math.round(
          (endTime - startTimeRef.current) / 1000
        );

        await trackEvent("session_completed", {
          session_id: call.id,
          user_id: authUser.id,
          tutor_id: authUser.role === "tutor" ? authUser.id : null,
          ended_at: endTime.toISOString(),
          duration_secs: durationSecs,
        });

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
