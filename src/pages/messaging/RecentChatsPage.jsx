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
  );
};

export default RecentChatsPage;
