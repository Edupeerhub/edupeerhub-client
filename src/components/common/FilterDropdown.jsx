import React from "react";
import { ChevronDown } from "lucide-react";

const FilterDropdown = ({
  filters,
  appliedFilters,
  setFilters,
  applyFilters,
  resetFilters,
  isOpen,
  setIsOpen,
}) => {
  const SUBJECT_OPTIONS = ["2", "Physics", "Biology", "English"];
  const RATING_OPTIONS = ["5", "4", "3"];
  const hasActiveFilters =
    appliedFilters.subjects.length > 0 ||
    appliedFilters.availability.length > 0 ||
    appliedFilters.ratings.length > 0;

  const handleFilterChange = (type, value) => {
    setFilters((prev) => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter((v) => v !== value)
        : [...prev[type], value],
    }));
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg text-sm transition ${
          hasActiveFilters
            ? "bg-primary text-white hover:bg-primary-focus"
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

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 p-4 border border-gray-300 rounded-lg bg-white shadow-lg z-10">
          <p className="text-sm font-medium text-gray-700 mb-3">
            Filter Options
          </p>

          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Subjects</p>
            <div className="space-y-1">
              {SUBJECT_OPTIONS.map((subject) => (
                <label key={subject} className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={filters.subjects.includes(subject)}
                    onChange={() => handleFilterChange("subjects", subject)}
                    className="mr-2 rounded"
                  />
                  {subject}
                </label>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Minimum Rating</p>
            <div className="space-y-1">
              {RATING_OPTIONS.map((rating) => (
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
              onClick={applyFilters}
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
  );
};

export default FilterDropdown;
