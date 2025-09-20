import React, { useState, useRef, useEffect } from "react";
import { Search, ChevronDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getTutors } from "../../lib/api/tutor/tutorApi";

// Mock tutors
const mockTutors = [
  {
    id: 1,
    name: "Mr. Ola Williams",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    subjects: ["Math", "English", "Chemistry", "Physics"],
    bio: "An experienced and passionate tutor dedicated to helping students achieve their academic goals.",
  },
  {
    id: 2,
    name: "Ms. Nkechi Onu",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    subjects: ["English", "Chemistry", "Physics"],
    bio: "An experienced and passionate tutor dedicated to helping students achieve their academic goals.",
  },
];

const StudentTutorsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { data, isLoading, error } = useQuery({
    queryKey: ["tutors"],
    queryFn: () => getTutors(),
  });

  if (isLoading) return <p>Loading tutors...</p>;
  if (error) return <p className="text-red-500">Failed to load tutors.</p>;
  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Search + Filter */}
      <div className="flex items-center gap-4 mb-6 relative">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search for Tutor"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>

        {/* Filter dropdown button */}
        <div className="relative" ref={filterRef}>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm"
          >
            Filter
            <ChevronDown className="w-4 h-4" />
          </button>

          {/* Dropdown */}
          {isFilterOpen && (
            <div className="absolute right-0 mt-2 w-48 p-3 border border-gray-300 rounded-lg bg-white shadow-lg z-10">
              <p className="text-sm text-gray-600 mb-2">Filter options</p>
              <div className="flex flex-col gap-2">
                <button className="px-3 py-1 text-sm bg-primary text-white rounded hover:bg-primary/80">
                  Apply Filter
                </button>
                <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100">
                  Reset
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {!data || data.rows?.length === 0 ? (
        <p className="flex justify-center items-center font-bold">
          No tutors found.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.rows.map((tutor) => (
            <div
              key={tutor.userId}
              className="flex flex-col p-4 border border-gray-200 rounded-lg shadow-lg hover:shadow-2xl transition"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
                  <img
                    src={tutor.user.profileImageUrl}
                    alt={`${tutor?.user.firstName} ${tutor?.user.lastName}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">
                    {tutor?.user.firstName} {tutor?.user.lastName}
                  </h3>
                  <p className="text-sm text-primary mt-1">
                    {tutor?.subjects?.map((s) => s.name).join(" • ")}
                  </p>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-3">
                    {tutor.bio}
                  </p>
                </div>
              </div>

              {/* <button className="mt-auto self-end px-4 py-2 text-sm bg-white border border-[#0457D4] text-[#0457D4] font-semibold rounded-full hover:bg-primary hover:text-white transition hover:border-transparent">
              View Profile
            </button> */}
              <button className="mt-auto self-end px-4 py-2 text-sm bg-primary text-white rounded-full hover:bg-primary/80">
                View Profile
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentTutorsPage;
