import { useState, useEffect } from "react";
import { StreamChat } from "stream-chat";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../../lib/api/common/getStreamApi";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

// Global client instance to persist across navigation
let globalChatClient = null;
let connectionPromise = null;

const useChatClient = (authUser, isLoggingOut = false) => {
  const [chatClient, setChatClient] = useState(globalChatClient);
  const [isLoading, setIsLoading] = useState(!globalChatClient);

  const { data } = useQuery({
    queryKey: ["streamToken", authUser?.id],
    queryFn: getStreamToken,
    enabled: !!authUser && !isLoggingOut,
    staleTime: 55 * 60 * 1000, // 55 min cache for 1h tokens
  });
  const token = data?.token;

  useEffect(() => {
    if (!authUser || !token) {
      setChatClient(null);
      setIsLoading(false);
      return;
    }

    const connect = async () => {
      setIsLoading(true);

      // If we already have a connected client for this user, reuse it
      if (globalChatClient && globalChatClient.user?.id === authUser.id) {
        setChatClient(globalChatClient);
        setIsLoading(false);
        return;
      }

      // If there's already a connection in progress, wait for it
      if (connectionPromise) {
        try {
          const client = await connectionPromise;
          setChatClient(client);
          setIsLoading(false);
          return;
        } catch (error) {
          console.error("Connection promise failed:", error);
        }
      }

      // Create new client and connection
      const client = StreamChat.getInstance(STREAM_API_KEY);

      connectionPromise = client
        .connectUser(
          {
            id: authUser.id,
            name: `${authUser.firstName} ${authUser.lastName}`,
            image: authUser.profileImageUrl,
          },
          token
        )
        .then(() => {
          globalChatClient = client;
          connectionPromise = null;
          return client;
        })
        .catch((error) => {
          connectionPromise = null;
          throw error;
        });

      try {
        const connectedClient = await connectionPromise;
        setChatClient(connectedClient);
      } catch (error) {
        console.error("Failed to connect user:", error);
        setChatClient(null);
      } finally {
        setIsLoading(false);
      }
    };

    connect();

    return () => {
      // Don't disconnect on cleanup to maintain connection during navigation
    };
  }, [authUser?.id, token]);

  const disconnectChatClient = () => {
    if (globalChatClient) {
      globalChatClient.disconnectUser().catch(console.error);
      globalChatClient = null;
      connectionPromise = null;
      setChatClient(null);
    }
  };

  return {
    isLoading,
    chatClient,
    disconnectChatClient,
  };
};

export default useChatClient;
