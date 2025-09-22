import { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

export function useChatClient(user, token) {
  const [client, setClient] = useState(null);

  useEffect(() => {
    if (!user || !token) return;

    const client = StreamChat.getInstance(STREAM_API_KEY);

    client
      .connectUser(
        {
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          image: user.profileImageUrl,
        },
        token
      )
      .then(() => setClient(client));

    // return () => {
    //   client.disconnectUser();
    //   setClient(null);
    // };
  }, [user?.id, token]);

  return client;
}
