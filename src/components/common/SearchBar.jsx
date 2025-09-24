import { Search } from "lucide-react";

const SearchBar = ({ value, onChange, onSearch }) => (
  <div className="flex-1 relative">
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
    <input
      type="text"
      placeholder="Search for Tutor"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && onSearch()}
      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
    />
  </div>
);

export default SearchBar;
