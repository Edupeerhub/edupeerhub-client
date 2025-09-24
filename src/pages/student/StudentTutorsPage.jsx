import React, { useState, useRef, useEffect } from "react";
import { Search, ChevronDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getTutors } from "../../lib/api/tutor/tutorApi";
import { Link } from "react-router-dom";

const StudentTutorsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    subjects: [],
    availability: [],
    ratings: [],
  });

  // Applied states - these trigger the actual API call
  const [appliedSearchQuery, setAppliedSearchQuery] = useState("");
  const [appliedFilters, setAppliedFilters] = useState({
    subjects: [],
    availability: [],
    ratings: [],
  });

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

  // Only triggers API call when appliedSearchQuery or appliedFilters change
  const { data, isLoading, error } = useQuery({
    queryKey: ["tutors", appliedSearchQuery, appliedFilters],
    queryFn: () =>
      getTutors({
        search: appliedSearchQuery,
        subjects:
          appliedFilters.subjects.length > 0
            ? appliedFilters.subjects
            : undefined,
        availability:
          appliedFilters.availability.length > 0
            ? appliedFilters.availability
            : undefined,
        ratings:
          appliedFilters.ratings.length > 0
            ? appliedFilters.ratings
            : undefined,
      }),
  });

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter((item) => item !== value)
        : [...prev[filterType], value],
    }));
  };

  const handleSearch = () => {
    setAppliedSearchQuery(searchQuery);
  };

  const handleApplyFilters = () => {
    setAppliedFilters(filters);
    setIsFilterOpen(false);
  };

  const resetFilters = () => {
    setFilters({
      subjects: [],
      availability: [],
      ratings: [],
    });
    setAppliedFilters({
      subjects: [],
      availability: [],
      ratings: [],
    });
    setSearchQuery("");
    setAppliedSearchQuery("");
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const hasActiveFilters =
    appliedFilters.subjects.length > 0 ||
    appliedFilters.availability.length > 0 ||
    appliedFilters.ratings.length > 0 ||
    appliedSearchQuery.length > 0;

  if (isLoading) return <p>Loading tutors...</p>;
  if (error) return <p className="text-red-500">Failed to load tutors.</p>;

  return (
    <div className="mx-auto px-1 sm:px-6 lg:px-8 md:py-6">
      {/* Search + Filter */}
      <div className="flex items-center gap-2 md:gap-4 mb-6 relative">
        <div className="flex-1 relative ">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search for Tutor"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchKeyPress}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/80 text-sm"
        >
          Search
        </button>

        {/* Filter dropdown button */}
        <div className="relative" ref={filterRef}>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg text-sm transition ${
              hasActiveFilters
                ? "bg-primary text-white hover:bg-primary/80"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Filter
            {hasActiveFilters && (
              <span className="ml-1 px-2 py-0.5 bg-white text-primary text-xs rounded-full">
                {appliedFilters.subjects.length +
                  appliedFilters.availability.length +
                  appliedFilters.ratings.length}
              </span>
            )}
            <ChevronDown className="w-4 h-4" />
          </button>

          {/* Dropdown */}
          {isFilterOpen && (
            <div className="absolute right-0 mt-2 w-64 p-4 border border-gray-300 rounded-lg bg-white shadow-lg z-10">
              <p className="text-sm font-medium text-gray-700 mb-3">
                Filter Options
              </p>

              {/* Subjects Filter */}
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Subjects</p>
                <div className="space-y-1">
                  {["Mathematics", "Physics", "Biology", "English"].map(
                    (subject) => (
                      <label
                        key={subject}
                        className="flex items-center text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={filters.subjects.includes(subject)}
                          onChange={() =>
                            handleFilterChange("subjects", subject)
                          }
                          className="mr-2 rounded"
                        />
                        {subject}
                      </label>
                    )
                  )}
                </div>
              </div>

              {/* Availability Filter */}
              {/* <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Availability</p>
                <div className="space-y-1">
                  {["Morning", "Afternoon", "Evening", "Weekend"].map(
                    (time) => (
                      <label key={time} className="flex items-center text-sm">
                        <input
                          type="checkbox"
                          checked={filters.availability.includes(time)}
                          onChange={() =>
                            handleFilterChange("availability", time)
                          }
                          className="mr-2 rounded"
                        />
                        {time}
                      </label>
                    )
                  )}
                </div>
              </div> */}

              {/* Rating Filter */}
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Minimum Rating</p>
                <div className="space-y-1">
                  {["5", "4", "3"].map((rating) => (
                    <label key={rating} className="flex items-center text-sm">
                      <input
                        type="checkbox"
                        checked={filters.ratings.includes(rating)}
                        onChange={() => handleFilterChange("ratings", rating)}
                        className="mr-2 rounded"
                      />
                      {rating}+ Stars
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t">
                <button
                  onClick={handleApplyFilters}
                  className="flex-1 px-3 py-2 text-sm bg-primary text-white rounded hover:bg-primary/80"
                >
                  Apply Filters
                </button>
                <button
                  onClick={resetFilters}
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-100"
                >
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

              <Link
                to={`/student/tutor-profile/${tutor.userId}`}
                className="mt-auto self-end px-4 py-2 text-sm bg-primary text-white rounded-full hover:bg-primary/80 text-center no-underline"
              >
                View Profile
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentTutorsPage;
