import { useNavigate } from "react-router-dom";
import {
  Avatar,
  useChannelStateContext,
  useChatContext,
} from "stream-chat-react";
import { useEffect, useState } from "react";
import CallButton from "../ui/CallButton";

const CustomChannelHeader = ({ channel, authUser, handleVideoCall }) => {
  const navigate = useNavigate();
  const { members } = useChannelStateContext();
  const { client } = useChatContext(); // 👈 gives you live user updates

  const [otherUser, setOtherUser] = useState(null);

  useEffect(() => {
    if (!channel || !authUser) return;

    const foundUser = Object.values(members).find(
      (member) => member.user?.id !== authUser?.id
    )?.user;

    if (foundUser) {
      setOtherUser(foundUser);

      // 👀 listen for presence updates in real-time
      const handleUserUpdated = (event) => {
        if (event.user?.id === foundUser.id) {
          setOtherUser({ ...foundUser, ...event.user });
        }
      };

      client.on("user.updated", handleUserUpdated);
      client.on("user.presence.changed", handleUserUpdated);

      return () => {
        client.off("user.updated", handleUserUpdated);
        client.off("user.presence.changed", handleUserUpdated);
      };
    }
  }, [members, channel, authUser, client]);

  if (!channel || !authUser || !otherUser) return null;

  const handleProfileClick = () => {
    navigate(`/profile/${otherUser.id}`);
  };

  return (
    <div className="flex items-center justify-between p-2 border-b bg-white">
      <div className="flex items-center space-x-3">
        <button
          // onClick={handleProfileClick}
          className="flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full transition-transform hover:scale-105"
        >
          <Avatar
            image={otherUser.image}
            name={otherUser.name || otherUser.id}
            size={40}
          />
        </button>

        <div>
          <button
            // onClick={handleProfileClick}
            className="text-lg font-semibold text-gray-900 hover:text-blue-600 focus:outline-none focus:underline transition-colors"
          >
            {otherUser.name || otherUser.id}
          </button>

          <div className="flex items-center space-x-2 mt-1">
            {otherUser.online ? (
              <>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <p className="text-sm text-green-600">Online</p>
              </>
            ) : (
              <>
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <p className="text-sm text-gray-500">Offline</p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* <div className="flex items-center space-x-2">
        <CallButton handleVideoCall={handleVideoCall} />
      </div> */}
    </div>
  );
};

export default CustomChannelHeader;
