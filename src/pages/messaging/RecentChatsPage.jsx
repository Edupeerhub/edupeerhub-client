import { Chat, ChannelList } from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";
import useAuthUser from "../../hooks/auth/useAuthUser";
import { useChatClient } from "../../hooks/messaging/useChatClient";
import CustomChannelPreview from "../../components/messaging/ChannelList";
import Spinner from "../../components/common/Spinner";

const RecentChatsPage = () => {
  const { authUser } = useAuthUser();
  const chatClient = useChatClient();

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
