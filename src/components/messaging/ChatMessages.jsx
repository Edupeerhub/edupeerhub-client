import { Chat } from "stream-chat-react";
import { StreamChat } from "stream-chat";
import { ChannelList } from "./ChannelList"; // Your custom ChannelList component

const client = StreamChat.getInstance("your-api-key"); // Replace with your Stream API key

const ChatMessages = () => {
  return (
    <Chat client={client} theme="messaging light">
      <ChannelList />
    </Chat>
  );
};

export default ChatMessages;
