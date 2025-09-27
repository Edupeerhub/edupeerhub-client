import React, { useState, useRef, useEffect } from "react";
import SearchBar from "../../components/common/SearchBar";
import FilterDropdown from "../../components/common/FilterDropdown";
import Spinner from "../../components/common/Spinner";
import { useTutors } from "../../hooks/tutor/useTutors";
import TutorSearchCard from "../../components/student/TutorSearchCard";

const StudentTutorsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedSearchQuery, setAppliedSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    subjects: [],
    availability: [],
    ratings: [],
  });
  const [appliedFilters, setAppliedFilters] = useState({
    subjects: [],
    availability: [],
    ratings: [],
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filterRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target))
        setIsFilterOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { data, isLoading, error } = useTutors(
    appliedSearchQuery,
    appliedFilters
  );

  const applyFilters = () => {
    setAppliedSearchQuery(searchQuery);
    setAppliedFilters(filters);
    setIsFilterOpen(false);
  };

  const resetFilters = () => {
    setFilters({ subjects: [], availability: [], ratings: [] });
    setAppliedFilters({ subjects: [], availability: [], ratings: [] });
    setSearchQuery("");
    setAppliedSearchQuery("");
  };

  if (isLoading) return <Spinner />;
  if (error) return <p className="text-red-500">Failed to load tutors.</p>;

  return (
    <div className="mx-auto px-1 sm:px-6 lg:px-8 md:py-6">
      <div className="flex items-center gap-2 md:gap-4 mb-6 relative">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          onSearch={applyFilters}
        />
        <FilterDropdown
          filters={filters}
          appliedFilters={appliedFilters}
          setFilters={setFilters}
          applyFilters={applyFilters}
          resetFilters={resetFilters}
          isOpen={isFilterOpen}
          setIsOpen={setIsFilterOpen}
        />
      </div>

      {!data?.rows?.length ? (
        <p className="flex justify-center items-center font-bold">
          No tutors found.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.rows.map((tutor) => (
            <TutorSearchCard key={tutor.userId} tutor={tutor} />
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentTutorsPage;
