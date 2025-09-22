import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../../lib/api/common/getStreamApi";

import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";

import ChatLoader from "../../components/ui/ChatLoader";
import CallButton from "../../components/ui/CallButton";
import { handleToastSuccess } from "../../utils/toastDisplayHandler";
import useAuthUser from "../../hooks/auth/useAuthUser";
import generateDmChannelId from "../../utils/generateChannelId";
import { useChatClient } from "../../hooks/messaging/useChatClient";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const ChatPage = () => {
  const { id: targetUserId } = useParams();

  const [channel, setChannel] = useState(null);
  const [isLoading, setLoading] = useState(true);

  const { authUser } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  const chatClient = useChatClient(authUser, tokenData?.token);

  useEffect(() => {
    const initChannel = async () => {
      if (!chatClient || !authUser || !targetUserId) return;

      const channelId = await generateDmChannelId(authUser.id, targetUserId);

      const currChannel = chatClient.channel("messaging", channelId, {
        members: [authUser.id, targetUserId],
      });

      await currChannel.watch();
      setChannel(currChannel);
      setLoading(false);
    };

    initChannel();
  }, [chatClient, authUser, targetUserId]);

  const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`;

      channel.sendMessage({
        text: `I've started a video call. Join me here: ${callUrl}`,
      });

      handleToastSuccess("Video call link sent successfully!");
    }
  };

  if (isLoading || !chatClient || !channel) return <ChatLoader />;

  return (
    <div className="h-screen w-full flex flex-col">
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className="w-full relative">
            <CallButton handleVideoCall={handleVideoCall} />
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput focus />
            </Window>
          </div>
          <Thread />
        </Channel>
      </Chat>
    </div>
  );
};
export default ChatPage;
