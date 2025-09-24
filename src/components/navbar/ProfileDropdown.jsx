import { LogOut } from "lucide-react";
import DropdownItem from "./DropdownItem";
import { profileDropdownItems } from "../../utils/navBarLinks";

const ProfileDropdown = ({ authUser, logoutMutation, closeDropdown }) => {
  const items = profileDropdownItems[authUser?.role] || [];

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
          .map(({ label, path, icon: Icon }, index) => (
            <DropdownItem
              key={index}
              label={label}
              path={path}
              icon={Icon}
              onClick={closeDropdown}
            />
          ))}
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
