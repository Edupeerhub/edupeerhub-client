import { Chat, ChannelList } from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";
import useAuthUser from "../../hooks/auth/useAuthUser";
import CustomChannelPreview from "../../components/messaging/ChannelList";
import Spinner from "../../components/common/Spinner";
import useChat from "../../hooks/messaging/useChatContext";

const RecentChatsPage = () => {
  const { authUser } = useAuthUser();
  const { chatClient } = useChat();

  if (!chatClient) return <Spinner />;

  return (
    <div className="flex flex-col h-full">
      {/* ✅ Page header */}
      <header className="sticky top-0 z-10 bg-white border-b px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-800">Recent Chats</h1>
        {/* Optional: actions, e.g. new chat button */}
        {/* <button className="text-sm text-blue-600">New Chat</button> */}
      </header>

      {/* ✅ Chat list below header */}
      <div className="flex-1 overflow-y-auto"></div>
      <Chat client={chatClient} theme="messaging light">
        <ChannelList
          Preview={CustomChannelPreview}
          filters={{ members: { $in: [authUser.id] } }}
          sort={{ last_message_at: -1 }}
          EmptyStateIndicator={() => (
            <div className="no-chats">You have no chats yet.</div>
          )}
        />
      </Chat>
    </div>
  );
};

export default RecentChatsPage;
