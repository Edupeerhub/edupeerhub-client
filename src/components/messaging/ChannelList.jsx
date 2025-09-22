import React from "react";
import { useNavigate } from "react-router-dom";
import { ChannelList, useChatContext } from "stream-chat-react";
import { Avatar } from "stream-chat-react";
import useAuthUser from "../../hooks/auth/useAuthUser";

const CustomChannelPreview = ({ channel }) => {
  const { client } = useChatContext();
  const navigate = useNavigate();
  const { authUser } = useAuthUser();

  const lastMessage = channel.state.messages[channel.state.messages.length - 1];

  const otherMember = Object.values(channel.state.members).find(
    (m) => m.user.id !== client.userID
  );

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
        size={40}
      />
      <div className="channel-info">
        <div className="channel-name">{otherMember?.user.name}</div>
        <div className="last-message-wrapper">
          <span className="last-message">
            {lastMessage?.text || "No messages yet"}
          </span>
          {lastMessage?.created_at && (
            <span className="timestamp">
              {new Date(lastMessage.created_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomChannelPreview;
