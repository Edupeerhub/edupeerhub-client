// RecentChatsPage.jsx
import React, { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import { Chat, ChannelList, useChatContext, Avatar } from "stream-chat-react";
import { useNavigate } from "react-router-dom";
import "stream-chat-react/dist/css/v2/index.css";
import useAuthUser from "../../hooks/auth/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../../lib/api/common/getStreamApi";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;
const client = StreamChat.getInstance(STREAM_API_KEY);

const CustomChannelPreview = ({ channel }) => {
  const { client } = useChatContext();
  const navigate = useNavigate();

  // Last message
  const lastMessage = channel.state.messages[channel.state.messages.length - 1];

  // Find the other member in the DM
  const otherMember = Object.values(channel.state.members).find(
    (m) => m.user.id !== client.userID
  );

  const handleClick = () => {
    navigate(`/chat/${otherMember.user.id}`);
  };

  return (
    <div
      onClick={handleClick}
      style={{
        display: "flex",
        alignItems: "center",
        padding: "10px",
        borderBottom: "1px solid #ddd",
        cursor: "pointer",
      }}
    >
      <Avatar
        image={otherMember?.user.image}
        name={otherMember?.user.name}
        size={40}
      />
      <div style={{ marginLeft: "10px" }}>
        <div style={{ fontWeight: "bold" }}>{otherMember?.user.name}</div>
        <div style={{ fontSize: "0.9em", color: "#555" }}>
          {lastMessage?.text || "No messages yet"}
        </div>
      </div>
    </div>
  );
};

const RecentChatsPage = () => {
  const [connected, setConnected] = useState(false);

  const { authUser } = useAuthUser();
  const STREAM_USER_ID = authUser?.id;

  const { data } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  const STREAM_USER_TOKEN = data?.token;

  useEffect(() => {
    if (!authUser || !STREAM_USER_TOKEN) return;

    const initClient = async () => {
      if (!client.user) {
        await client.connectUser(
          {
            id: STREAM_USER_ID,
            name: `${authUser.firstName} ${authUser.lastName}`,
            image: authUser.profileImageUrl,
          },
          STREAM_USER_TOKEN
        );
      }
      setConnected(true);
    };

    initClient();

    // return () => {
    //   client.disconnectUser();
    // };
  }, [authUser, STREAM_USER_TOKEN]);

  if (!connected) return <div>Loading chats...</div>;

  return (
    <Chat client={client} theme="messaging light">
      <ChannelList
        Preview={CustomChannelPreview}
        filters={{ members: { $in: [STREAM_USER_ID] } }}
        sort={{ last_message_at: -1 }}
      />
    </Chat>
  );
};

export default RecentChatsPage;
