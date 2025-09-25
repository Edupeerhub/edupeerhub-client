import { LogOut } from "lucide-react";
import DropdownItem from "./DropdownItem";
import { profileDropdownItems } from "../../utils/navBarLinks";
import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "../../lib/api/user/userApi";

const ProfileDropdown = ({ authUser, logoutMutation, closeDropdown }) => {
  const items = profileDropdownItems[authUser?.role] || [];

  const { data: user } = useQuery({
    queryKey: ["userProfile"],
    queryFn: getUserProfile,
    enabled: !!authUser,
  });

  const tutor = user?.tutor;

  const getTutorStatus = () => {
    if (!tutor) return null;
    if (tutor.approvalStatus === 'approved' && user.accountStatus === 'active') {
      return 'active';
    }
    return tutor.approvalStatus;
  }

  const tutorStatus = getTutorStatus();

  const isTutorAndRestricted = authUser?.role === 'tutor' && (tutorStatus === 'pending' || tutorStatus === 'rejected');

  return (
    <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100">
        <p className="text-sm font-medium text-gray-900">
          {authUser?.firstName} {authUser?.lastName}
        </p>
        <p className="text-sm text-gray-500 truncate">{authUser?.email}</p>
      </div>

      {/* Items */}
      <div className="py-1">
        {items
          .filter((item) => item.label !== "Sign Out")
          .map(({ label, path, icon: Icon }, index) => {
            const isDisabled = isTutorAndRestricted && label !== 'Dashboard';
            return (
                <DropdownItem
                key={index}
                label={label}
                path={isDisabled ? '#' : path}
                icon={Icon}
                onClick={isDisabled ? (e) => e.preventDefault() : closeDropdown}
                disabled={isDisabled}
                />
            );
            })}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 py-1">
        <DropdownItem
          icon={LogOut}
          label="Sign Out"
          danger
          onClick={() => {
            logoutMutation();
            closeDropdown();
          }}
        />
      </div>
    </div>
  );
};

export default ProfileDropdown;