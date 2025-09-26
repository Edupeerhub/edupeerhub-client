import { ChatContext } from "../hooks/messaging/useChatContext";
import useChatClient from "../hooks/messaging/useChatClient";
import useAuthUser from "../hooks/auth/useAuthUser";

export function ChatProvider({ children }) {
  const { authUser } = useAuthUser();
  const { isLoading, chatClient, disconnectChatClient } =
    useChatClient(authUser);

  // Optional: show loading state while chat client connects
  // if (isLoading) return <div>Loading chat...</div>;

  return (
    <ChatContext.Provider value={{ chatClient, disconnectChatClient }}>
      {children}
    </ChatContext.Provider>
  );
}
