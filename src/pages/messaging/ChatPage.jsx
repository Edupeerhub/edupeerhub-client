import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Chat,
  Channel,
  ChannelHeader,
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

const ChatPage = () => {
  const { id: targetUserId } = useParams();
  const [channel, setChannel] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const navigate = useNavigate();

  const { authUser } = useAuthUser();

  const chatClient = useChatClient();

  useEffect(() => {
    if (!chatClient || !authUser || !targetUserId) return;

    const initChannel = async () => {
      setLoading(true);
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
    if (!channel) return;

    const role = authUser.role;
    const routePrefix = role === "tutor" ? "/tutor" : "/student";
    const callUrl = `${routePrefix}/call/${channel.id}`;

    channel.sendMessage({
      text: `Join my call: ${window.location.origin}${callUrl}`,
    });

    navigate(callUrl);

    handleToastSuccess("Video call link sent!");
  };

  if (!chatClient || !channel || isLoading) return <ChatLoader />;

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
