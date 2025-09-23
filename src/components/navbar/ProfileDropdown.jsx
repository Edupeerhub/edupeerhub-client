import {
  User,
  Settings,
  HelpCircle,
  LogOut,
  CreditCard,
  Shield,
} from "lucide-react";

const DropdownItem = ({ icon: Icon, label, action, onSelect, danger }) => (
  <button
    onClick={() => onSelect(action)}
    className={`flex items-center w-full px-4 py-2 text-sm transition-colors ${
      danger
        ? "text-red-600 hover:bg-red-50"
        : "text-gray-700 hover:bg-gray-200"
    }`}
  >
    <Icon className="h-4 w-4 mr-3" />
    {label}
  </button>
);

const ProfileDropdown = ({ authUser, onSelect }) => (
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
      <DropdownItem
        icon={User}
        label="View Profile"
        action="profile"
        onSelect={onSelect}
      />
      <DropdownItem
        icon={Settings}
        label="Account Settings"
        action="settings"
        onSelect={onSelect}
      />
      <DropdownItem
        icon={CreditCard}
        label="Billing & Payments"
        action="billing"
        onSelect={onSelect}
      />
      <DropdownItem
        icon={Shield}
        label="Privacy & Security"
        action="privacy"
        onSelect={onSelect}
      />
    </div>

    {/* Footer */}
    <div className="border-t border-gray-100 py-1">
      <DropdownItem
        icon={HelpCircle}
        label="Help & Support"
        action="help"
        onSelect={onSelect}
      />
      <DropdownItem
        icon={LogOut}
        label="Sign Out"
        action="logout"
        onSelect={onSelect}
        danger
      />
    </div>
  </div>
);

export default ProfileDropdown;
