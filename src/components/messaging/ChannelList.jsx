import React from "react";
import { useNavigate } from "react-router-dom";
import { useChatContext } from "stream-chat-react";
import { Avatar } from "stream-chat-react";
import useAuthUser from "../../hooks/auth/useAuthUser";

const CustomChannelPreview = ({ channel }) => {
  const { client } = useChatContext();
  const navigate = useNavigate();
  const { authUser } = useAuthUser();

  // Get last message
  const lastMessage = channel.state.messages[channel.state.messages.length - 1];

  // Find the other member in the DM
  const otherMember = Object.values(channel.state.members).find(
    (m) => m.user.id !== client.userID
  );

  // Count of unread messages
  const unreadCount = channel.countUnread();

  const handleClick = () => {
    const role = authUser.role;
    const routePrefix = role === "tutor" ? "/tutor" : "/student";
    navigate(`${routePrefix}/chat/${otherMember.user.id}`);
  };

  return (
    <div onClick={handleClick} className="channel-preview">
      <Avatar
        image={otherMember?.user.image}
        name={otherMember?.user.name}
        size={50}
      />
      <div className="channel-info">
        <div className="channel-top">
          <div className="channel-name">{otherMember?.user.name}</div>
          {lastMessage?.created_at && (
            <div className="timestamp">
              {new Date(lastMessage.created_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          )}
        </div>
        <div className="channel-bottom">
          <div className="last-message">
            {lastMessage?.text || "No messages yet"}
          </div>
          {unreadCount > 0 && <div className="unread-count">{unreadCount}</div>}
        </div>
      </div>
    </div>
  );
};

export default CustomChannelPreview;
