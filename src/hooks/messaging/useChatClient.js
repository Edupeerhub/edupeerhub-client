import { useState, useEffect } from "react";
import { StreamChat } from "stream-chat";
import useAuthUser from "../auth/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../../lib/api/common/getStreamApi";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

export const useChatClient = () => {
  const { authUser } = useAuthUser();

  const [chatClient, setChatClient] = useState(null);

  const { data } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
    staleTime: 55 * 60 * 1000, // 55 min cache for 1h tokens
  });
  const token = data?.token;

  useEffect(() => {
    if (!authUser || !token) return;

    const client = StreamChat.getInstance(STREAM_API_KEY);

    const connect = async () => {
      if (!client.user) {
        await client.connectUser(
          {
            id: authUser.id,
            name: `${authUser.firstName} ${authUser.lastName}`,
            image: authUser.profileImageUrl,
          },
          token
        );
      }
      setChatClient(client);
    };

    connect();
  }, [authUser, token]);

  return chatClient;
};
