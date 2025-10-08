import { ChatContext } from "../hooks/messaging/useChatContext";
import useChatClient from "../hooks/messaging/useChatClient";
import { useAuth } from "../hooks/useAuthContext";

export function ChatProvider({ children }) {
  const { authUser } = useAuth();
  const { chatClient, disconnectChatClient } = useChatClient(authUser);

  return (
    <ChatContext.Provider value={{ chatClient, disconnectChatClient }}>
      {children}
    </ChatContext.Provider>
  );
}
