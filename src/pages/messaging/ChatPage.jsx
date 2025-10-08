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
// import { handleToastSuccess } from "../../utils/toastDisplayHandler";
import generateDmChannelId from "../../utils/generateChannelId";
import CustomChannelHeader from "../../components/messaging/CustomChannelHeader";
import useChat from "../../hooks/messaging/useChatContext";
import { useAuth } from "../../hooks/useAuthContext";

const ChatPage = () => {
  const { id: targetUserId } = useParams();
  const [channel, setChannel] = useState(null);
  const [isLoading, setLoading] = useState(true);
  // const navigate = useNavigate();

  const { authUser } = useAuth();

  const { chatClient } = useChat();

  useEffect(() => {
    if (!chatClient || !authUser || !targetUserId) return;

    const initChannel = async () => {
      try {
        setLoading(true);
        const channelId = await generateDmChannelId(authUser.id, targetUserId);
        const currChannel = chatClient.channel("messaging", channelId, {
          members: [authUser.id, targetUserId],
        });
        await currChannel.watch();
        setChannel(currChannel);
      } catch (error) {
        console.error("Failed to initialize channel:", error);
        // Could show error state or redirect
      } finally {
        setLoading(false);
      }
    };

    initChannel();

    // Cleanup
    return () => {
      if (channel) {
        channel.stopWatching().catch(console.error);
      }
    };
  }, [chatClient, authUser, targetUserId]);

  // const handleVideoCall = () => {
  //   if (!channel) return;

  //   const role = authUser.role;
  //   const routePrefix = role === "tutor" ? "/tutor" : "/student";
  //   const callUrl = `${routePrefix}/call/${channel.id}`;

  //   channel.sendMessage({
  //     text: `Join my call: ${window.location.origin}${callUrl}`,
  //   });

  //   navigate(callUrl);

  //   handleToastSuccess("Video call link sent!");
  // };

  if (!chatClient || !channel || isLoading) return <ChatLoader />;

  return (
    // Override the parent padding and make this fill the available space
    <div className="fixed inset-0 top-16 left-0 lg:left-64 flex flex-col bg-white">
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className="flex flex-col h-full relative">
            <Window>
              {/* Fixed header */}
              <div className="flex-shrink-0">
                <CustomChannelHeader
                  channel={channel}
                  authUser={authUser}
                  // handleVideoCall={handleVideoCall}
                />
              </div>
              {/* <ChannelHeader /> */}

              {/* Scrollable message area */}
              <div className="flex-1 overflow-hidden">
                <MessageList />
              </div>

              {/* Fixed input */}
              <div className="flex-shrink-0">
                <MessageInput focus />
              </div>
            </Window>
          </div>
          <Thread />
        </Channel>
      </Chat>
    </div>
  );
};

export default ChatPage;
