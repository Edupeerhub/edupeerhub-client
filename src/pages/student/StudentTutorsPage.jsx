import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Search, ChevronDown, X, SlidersHorizontal } from "lucide-react";
import "./StudentTutorsPage.css";
import FilterPanel from "../../components/student/FilterPanel";
import TutorCard from "./TutorSearchCard";

// Mock data for tutors
const mockTutors = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    subjects: ["Mathematics", "Physics"],
    rating: 4.9,
    reviewCount: 127,
    hourlyRate: 45,
    location: "New York, NY",
    experience: "5 years",
    availability: "Available",
    bio: "Experienced math and physics tutor with a passion for helping students excel.",
    languages: ["English", "Spanish"],
    education: "MIT - Mathematics",
    responseTime: "Usually responds within 1 hour",
    totalStudents: 89,
    completedSessions: 1250,
  },
  {
    id: 2,
    name: "Michael Chen",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    subjects: ["Computer Science", "Programming"],
    rating: 4.8,
    reviewCount: 95,
    hourlyRate: 60,
    location: "San Francisco, CA",
    experience: "7 years",
    availability: "Busy",
    bio: "Software engineer turned educator, specializing in programming and computer science.",
    languages: ["English", "Mandarin"],
    education: "Stanford - Computer Science",
    responseTime: "Usually responds within 2 hours",
    totalStudents: 156,
    completedSessions: 2100,
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    subjects: ["English Literature", "Writing"],
    rating: 4.7,
    reviewCount: 203,
    hourlyRate: 35,
    location: "Austin, TX",
    experience: "4 years",
    availability: "Available",
    bio: "Published author and literature enthusiast helping students master writing skills.",
    languages: ["English"],
    education: "University of Texas - English Literature",
    responseTime: "Usually responds within 30 minutes",
    totalStudents: 234,
    completedSessions: 1800,
  },
  {
    id: 4,
    name: "David Kim",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    subjects: ["Chemistry", "Biology"],
    rating: 4.9,
    reviewCount: 156,
    hourlyRate: 50,
    location: "Boston, MA",
    experience: "6 years",
    availability: "Available",
    bio: "PhD in Chemistry with extensive experience in both research and teaching.",
    languages: ["English", "Korean"],
    education: "Harvard - Chemistry PhD",
    responseTime: "Usually responds within 1 hour",
    totalStudents: 178,
    completedSessions: 1950,
  },
  {
    id: 5,
    name: "Lisa Thompson",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    subjects: ["History", "Social Studies"],
    rating: 4.6,
    reviewCount: 89,
    hourlyRate: 40,
    location: "Chicago, IL",
    experience: "8 years",
    availability: "Available",
    bio: "Former high school teacher passionate about making history engaging and accessible.",
    languages: ["English", "French"],
    education: "Northwestern - History",
    responseTime: "Usually responds within 45 minutes",
    totalStudents: 145,
    completedSessions: 1600,
  },
  {
    id: 6,
    name: "Ahmed Hassan",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    subjects: ["Arabic", "Islamic Studies"],
    rating: 4.8,
    reviewCount: 67,
    hourlyRate: 30,
    location: "Detroit, MI",
    experience: "3 years",
    availability: "Available",
    bio: "Native Arabic speaker with expertise in language instruction and cultural studies.",
    languages: ["Arabic", "English"],
    education: "University of Michigan - Middle Eastern Studies",
    responseTime: "Usually responds within 2 hours",
    totalStudents: 98,
    completedSessions: 890,
  },
];

// All available subjects for filtering
const allSubjects = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Computer Science",
  "Programming",
  "English Literature",
  "Writing",
  "History",
  "Social Studies",
  "Arabic",
  "Islamic Studies",
  "Spanish",
  "French",
  "Economics",
  "Psychology",
];

// Sort options
const sortOptions = [
  { value: "rating", label: "Highest Rated" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "experience", label: "Most Experienced" },
  { value: "reviews", label: "Most Reviews" },
];

// Main TutorSearchPage Component
const StudentTutorsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [filters, setFilters] = useState({
    subjects: [],
    minRating: 0,
    maxPrice: 100,
    availability: "all",
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const tutorsPerPage = 6;

  // Filter and sort tutors
  const filteredAndSortedTutors = useMemo(() => {
    let filtered = mockTutors.filter((tutor) => {
      // Search query filter
      const matchesSearch =
        searchQuery === "" ||
        tutor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tutor.subjects.some((subject) =>
          subject.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        tutor.bio.toLowerCase().includes(searchQuery.toLowerCase());

      // Subject filter
      const matchesSubjects =
        filters.subjects.length === 0 ||
        filters.subjects.some((subject) => tutor.subjects.includes(subject));

      // Rating filter
      const matchesRating = tutor.rating >= filters.minRating;

      // Price filter
      const matchesPrice = tutor.hourlyRate <= filters.maxPrice;

      // Availability filter
      const matchesAvailability =
        filters.availability === "all" ||
        (filters.availability === "available" &&
          tutor.availability === "Available") ||
        (filters.availability === "busy" && tutor.availability === "Busy");

      return (
        matchesSearch &&
        matchesSubjects &&
        matchesRating &&
        matchesPrice &&
        matchesAvailability
      );
    });

    // Sort tutors
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "price-low":
          return a.hourlyRate - b.hourlyRate;
        case "price-high":
          return b.hourlyRate - a.hourlyRate;
        case "experience":
          return parseInt(b.experience) - parseInt(a.experience);
        case "reviews":
          return b.reviewCount - a.reviewCount;
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchQuery, filters, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedTutors.length / tutorsPerPage);
  const startIndex = (currentPage - 1) * tutorsPerPage;
  const paginatedTutors = filteredAndSortedTutors.slice(
    startIndex,
    startIndex + tutorsPerPage
  );

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters, sortBy]);

  // Simulate loading for infinite scroll/pagination
  const handleLoadMore = useCallback(() => {
    if (currentPage < totalPages) {
      setIsLoading(true);
      setTimeout(() => {
        setCurrentPage((prev) => prev + 1);
        setIsLoading(false);
      }, 500);
    }
  }, [currentPage, totalPages]);

  const handleContactTutor = (tutor) => {
    alert(`Contacting ${tutor.name}...`);
    // Here you would implement the actual contact functionality
  };

  const handleClearFilters = () => {
    setFilters({
      subjects: [],
      minRating: 0,
      maxPrice: 100,
      availability: "all",
    });
    setSearchQuery("");
  };

  const activeFiltersCount =
    filters.subjects.length +
    (filters.minRating > 0 ? 1 : 0) +
    (filters.maxPrice < 100 ? 1 : 0) +
    (filters.availability !== "all" ? 1 : 0);

  return (
    <div>
      {/* Search and Filters */}
      <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, subject, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-bar w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
          </div>

          {/* Filter Button (Mobile) */}
          <button
            onClick={() => setIsFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <SlidersHorizontal className="w-5 h-5" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-sm text-gray-600">Active filters:</span>
            {filters.subjects.map((subject) => (
              <span
                key={subject}
                className="filter-badge px-3 py-1 bg-primary/10 text-primary rounded-full text-sm flex items-center gap-1"
              >
                {subject}
                <button
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      subjects: prev.subjects.filter((s) => s !== subject),
                    }))
                  }
                  className="hover:bg-primary/20 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {filters.minRating > 0 && (
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                {filters.minRating}+ stars
              </span>
            )}
            {filters.maxPrice < 100 && (
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                Under ${filters.maxPrice}/hr
              </span>
            )}
            {filters.availability !== "all" && (
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                {filters.availability === "available" ? "Available" : "Busy"}
              </span>
            )}
            <button
              onClick={handleClearFilters}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Clear all
            </button>
          </div>
        )}

        <div className="flex gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-heading font-semibold text-lg">Filters</h3>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={handleClearFilters}
                    className="text-sm text-primary hover:text-primary/80"
                  >
                    Clear all
                  </button>
                )}
              </div>

              <div className="space-y-6">
                {/* Subjects */}
                <div>
                  <h4 className="font-medium mb-3">Subjects</h4>
                  <div className="filter-scroll space-y-2 max-h-48 overflow-y-auto">
                    {allSubjects.map((subject) => (
                      <label key={subject} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={filters.subjects.includes(subject)}
                          onChange={() => {
                            setFilters((prev) => ({
                              ...prev,
                              subjects: prev.subjects.includes(subject)
                                ? prev.subjects.filter((s) => s !== subject)
                                : [...prev.subjects, subject],
                            }));
                          }}
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <span className="text-sm">{subject}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <h4 className="font-medium mb-3">Minimum Rating</h4>
                  <select
                    value={filters.minRating}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        minRating: Number(e.target.value),
                      }))
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value={0}>Any Rating</option>
                    <option value={4}>4+ Stars</option>
                    <option value={4.5}>4.5+ Stars</option>
                    <option value={4.8}>4.8+ Stars</option>
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <h4 className="font-medium mb-3">Max Price per Hour</h4>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    value={filters.maxPrice}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        maxPrice: Number(e.target.value),
                      }))
                    }
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600 mt-1">
                    <span>$20</span>
                    <span>${filters.maxPrice}</span>
                    <span>$100+</span>
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <h4 className="font-medium mb-3">Availability</h4>
                  <select
                    value={filters.availability}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        availability: e.target.value,
                      }))
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="all">All Tutors</option>
                    <option value="available">Available Now</option>
                    <option value="busy">Busy</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-heading font-semibold text-xl text-accent">
                  {filteredAndSortedTutors.length} Tutors Found
                </h2>
                {searchQuery && (
                  <p className="text-gray-600 mt-1">
                    Results for "{searchQuery}"
                  </p>
                )}
              </div>
            </div>

            {/* Tutors Grid */}
            {filteredAndSortedTutors.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="font-heading font-semibold text-xl text-accent mb-2">
                  No tutors found
                </h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search criteria or filters
                </p>
                <button
                  onClick={handleClearFilters}
                  className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <>
                <div className="tutor-grid grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {paginatedTutors.map((tutor) => (
                    <TutorCard
                      key={tutor.id}
                      tutor={tutor}
                      onContact={handleContactTutor}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-4">
                    {currentPage < totalPages && (
                      <button
                        onClick={handleLoadMore}
                        disabled={isLoading}
                        className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? "Loading..." : "Load More Tutors"}
                      </button>
                    )}
                    <div className="text-sm text-gray-600">
                      Showing{" "}
                      {Math.min(
                        currentPage * tutorsPerPage,
                        filteredAndSortedTutors.length
                      )}{" "}
                      of {filteredAndSortedTutors.length} tutors
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Panel */}
      <FilterPanel
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        allSubjects={allSubjects}
        onFiltersChange={setFilters}
        onClearFilters={handleClearFilters}
      />
    </div>
  );
};

export default StudentTutorsPage;
