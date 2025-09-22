import { useNavigate } from "react-router-dom";
import CallButton from "../ui/CallButton";

const CustomChannelHeader = ({ channel, authUser, handleVideoCall }) => {
  const navigate = useNavigate();

  if (!channel || !authUser) return null;

  // Get the other user (not the current user)
  const otherUser = Object.values(channel.state.members).find(
    (member) => member.user.id !== authUser.id
  );

  if (!otherUser) return null;

  const handleProfileClick = () => {
    // Adjust the route based on your app structure
    navigate(`/profile/${otherUser.user.id}`);
  };

  return (
    <div className="flex items-center justify-between p-1 border-b bg-white">
      <div className="flex items-center space-x-3">
        {/* Clickable Avatar */}
        <button
          onClick={handleProfileClick}
          className="flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full transition-transform hover:scale-105"
          title={`View ${otherUser.user.name || otherUser.user.id}'s profile`}
        >
          <img
            src={
              otherUser.user.image ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                otherUser.user.name || otherUser.user.id
              )}&background=4ca1f0&color=fff`
            }
            alt={otherUser.user.name || otherUser.user.id}
            className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
          />
        </button>

        {/* User Info */}
        <div>
          <button
            onClick={handleProfileClick}
            className="text-lg font-semibold text-gray-900 hover:text-blue-600 focus:outline-none focus:underline transition-colors"
            title={`View ${otherUser.user.name || otherUser.user.id}'s profile`}
          >
            {otherUser.user.name || otherUser.user.id}
          </button>

          {/* Online Status */}
          <div className="flex items-center space-x-2 mt-1">
            {otherUser.user.online ? (
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

      {/* Optional: Additional header actions */}
      <div className="flex items-center space-x-2">
        <CallButton handleVideoCall={handleVideoCall} />
      </div>
    </div>
  );
};

export default CustomChannelHeader;
