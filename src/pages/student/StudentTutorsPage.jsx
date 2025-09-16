import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import './StudentTutorsPage.css';
// This component is replaced by TutorSearchPage below

// Mock data for tutors
const mockTutors = [
  {
    id: 1,
    name: "Ms. Oby Ezekwe",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    subjects: ["Maths.", "English", "Chem", "Physics"],
    rating: 4.9,
    reviewCount: 125,
    hourlyRate: 45,
    location: "Lagos, Nigeria",
    experience: "5 years",
    availability: "Available",
    bio: "An experienced and passionate tutor dedicated to helping students achieving their academic goals.",
    languages: ["English", "Spanish"],
    education: "MIT - Mathematics",
    responseTime: "Usually responds within 1 hour",
    totalStudents: 89,
    completedSessions: 1250
  },
  {
    id: 2,
    name: "Ms. Nkechi Onu",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    subjects: ["Maths.", "English", "Chem", "Physics"],
    rating: 4.9,
    reviewCount: 98,
    hourlyRate: 40,
    location: "Abuja, Nigeria",
    experience: "4 years",
    availability: "Available",
    bio: "An experienced and passionate tutor dedicated to helping students achieving their academic goals.",
    languages: ["English", "Spanish"],
    education: "MIT - Mathematics",
    responseTime: "Usually responds within 1 hour",
    totalStudents: 89,
    completedSessions: 1250
  },
  {
    id: 3,
    name: "Mr. Wale Ola",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    subjects: ["Maths.", "English", "Chem", "Physics"],
    rating: 4.9,
    reviewCount: 156,
    hourlyRate: 50,
    location: "Port Harcourt, Nigeria",
    experience: "6 years",
    availability: "Available",
    bio: "An experienced and passionate tutor dedicated to helping students achieving their academic goals.",
    languages: ["English", "Spanish"],
    education: "MIT - Mathematics",
    responseTime: "Usually responds within 1 hour",
    totalStudents: 89,
    completedSessions: 1250
  },
  {
    id: 4,
    name: "Ms. Esther Ali",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    subjects: ["Maths.", "English", "Chem", "Physics"],
    rating: 4.9,
    reviewCount: 87,
    hourlyRate: 35,
    location: "Kano, Nigeria",
    experience: "3 years",
    availability: "Available",
    bio: "An experienced and passionate tutor dedicated to helping students achieving their academic goals.",
    languages: ["English", "Spanish"],
    education: "MIT - Mathematics",
    responseTime: "Usually responds within 1 hour",
    totalStudents: 89,
    completedSessions: 1250
  },
  {
    id: 5,
    name: "Mr. Musa Garba",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    subjects: ["Maths.", "English", "Chem", "Physics"],
    rating: 4.9,
    reviewCount: 142,
    hourlyRate: 55,
    location: "Kaduna, Nigeria",
    experience: "7 years",
    availability: "Available",
    bio: "An experienced and passionate tutor dedicated to helping students achieving their academic goals.",
    languages: ["English", "Spanish"],
    education: "MIT - Mathematics",
    responseTime: "Usually responds within 1 hour",
    totalStudents: 89,
    completedSessions: 1250
  },
  {
  id: 6,
    name: "Mr. Chudi Eze",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    subjects: ["Maths.", "English", "Chem", "Physics"],
    rating: 4.9,
    reviewCount: 203,
    hourlyRate: 60,
    location: "Enugu, Nigeria",
    experience: "8 years",
    availability: "Available",
    bio: "An experienced and passionate tutor dedicated to helping students achieving their academic goals.",
    languages: ["English", "Spanish"],
    education: "MIT - Mathematics",
    responseTime: "Usually responds within 1 hour",
    totalStudents: 89,
    completedSessions: 1250
  },
  {
    id: 7,
    name: "Ms. Amara Sani",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    subjects: ["Maths.", "English", "Chem", "Physics"],
    rating: 4.9,
    reviewCount: 76,
    hourlyRate: 38,
    location: "Sokoto, Nigeria",
    experience: "3 years",
    availability: "Available",
    bio: "An experienced and passionate tutor dedicated to helping students achieving their academic goals.",
    languages: ["English", "Spanish"],
    education: "MIT - Mathematics",
    responseTime: "Usually responds within 1 hour",
    totalStudents: 89,
    completedSessions: 1250
  },
  {
    id: 8,
    name: "Mr. Mike Ajayi",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    subjects: ["Maths.", "English", "Chem", "Physics"],
    rating: 4.9,
    reviewCount: 134,
    hourlyRate: 48,
    location: "Ibadan, Nigeria",
    experience: "5 years",
    availability: "Available",
    bio: "An experienced and passionate tutor dedicated to helping students achieving their academic goals.",
    languages: ["English", "Spanish"],
    education: "MIT - Mathematics",
    responseTime: "Usually responds within 1 hour",
    totalStudents: 89,
    completedSessions: 1250
  },
  {
    id: 9,
    name: "Mr. Ola Williams",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    subjects: ["Maths.", "English", "Chem", "Physics"],
    rating: 4.9,
    reviewCount: 167,
    hourlyRate: 52,
    location: "Abeokuta, Nigeria",
    experience: "6 years",
    availability: "Available",
    bio: "An experienced and passionate tutor dedicated to helping students achieving their academic goals.",
    languages: ["English", "Spanish"],
    education: "MIT - Mathematics",
    responseTime: "Usually responds within 1 hour",
    totalStudents: 89,
    completedSessions: 1250
  },
  {
    id: 10,
    name: "Mr. Steve Aina",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    subjects: ["Maths.", "English", "Chem", "Physics"],
    rating: 4.9,
    reviewCount: 189,
    hourlyRate: 42,
    location: "Benin City, Nigeria",
    experience: "4 years",
    availability: "Available",
    bio: "An experienced and passionate tutor dedicated to helping students achieving their academic goals.",
    languages: ["English", "Spanish"],
    education: "MIT - Mathematics",
    responseTime: "Usually responds within 1 hour",
    totalStudents: 89,
    completedSessions: 1250
  },
  {
    id: 11,
    name: "Ms. Ronke Ali",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    subjects: ["Maths.", "English", "Chem", "Physics"],
    rating: 4.9,
    reviewCount: 112,
    hourlyRate: 46,
    location: "Ilorin, Nigeria",
    experience: "5 years",
    availability: "Available",
    bio: "An experienced and passionate tutor dedicated to helping students achieving their academic goals.",
    languages: ["English", "Spanish"],
    education: "MIT - Mathematics",
    responseTime: "Usually responds within 1 hour",
    totalStudents: 89,
    completedSessions: 1250
  },
  {
    id: 12,
    name: "Mr. Dele Mina",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    subjects: ["Maths.", "English", "Chem", "Physics"],
    rating: 4.9,
    reviewCount: 95,
    hourlyRate: 44,
    location: "Jos, Nigeria",
    experience: "4 years",
    availability: "Available",
    bio: "An experienced and passionate tutor dedicated to helping students achieving their academic goals.",
    languages: ["English", "Spanish"],
    education: "MIT - Mathematics",
    responseTime: "Usually responds within 1 hour",
    totalStudents: 89,
    completedSessions: 1250
 }
];

// All available subjects for filtering
const allSubjects = [
  "Mathematics", "Physics", "Chemistry", "Biology", "Computer Science", 
  "Programming", "English Literature", "Writing", "History", "Social Studies",
  "Arabic", "Islamic Studies", "Spanish", "French", "Economics", "Psychology"
];

// TutorCard Component
const TutorCard = ({ tutor, onContact }) => {
  return (
    <div className="tutor-card bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <img
          src={tutor.avatar}
          alt={tutor.name}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-heading font-semibold text-lg text-accent truncate">
            {tutor.name}
          </h3>
          {/* Removed star rating and availability */}
        </div>
        {/* Removed hourly rate display */}
      </div>

      {/* Subjects */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {tutor.subjects.map((subject, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
            >
              {subject}
            </span>
          ))}
        </div>
      </div>

      {/* Bio */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {tutor.bio}
      </p>

      {/* Removed stats: location, experience, students, sessions */}

      {/* Education & Response Time */}
      <div className="mb-4 space-y-1">
        <div className="text-sm text-gray-600">
          <span className="font-medium">Education:</span> {tutor.education}
        </div>
        <div className="text-sm text-gray-600">
          {tutor.responseTime}
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={() => onContact(tutor)}
          className="bg-primary text-white px-5 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors duration-200"
        >
          View Profile
        </button>
      </div>
    </div>
  );
};

// Filter Component
const FilterPanel = ({ 
  isOpen, 
  onClose, 
  filters, 
  onFiltersChange, 
  onClearFilters 
}) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleSubjectToggle = (subject) => {
    setLocalFilters(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject]
    }));
  };

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      subjects: [],
      minRating: 0,
      maxPrice: 100,
      availability: 'all'
    };
    setLocalFilters(clearedFilters);
    onClearFilters();
    onClose();
  };

  if (!isOpen) return null;

  return (
    // Panel available on all screen sizes
    <div className="fixed inset-0 bg-black/50 z-50">
      <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-heading font-semibold text-lg">Filters</h3>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Filter Content */}
          <div className="space-y-6">
            {/* Subjects */}
            <div>
              <h4 className="font-medium mb-3">Subjects</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {allSubjects.map(subject => (
                  <label key={subject} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={localFilters.subjects.includes(subject)}
                      onChange={() => handleSubjectToggle(subject)}
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
                value={localFilters.minRating}
                onChange={(e) => setLocalFilters(prev => ({ ...prev, minRating: Number(e.target.value) }))}
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
                value={localFilters.maxPrice}
                onChange={(e) => setLocalFilters(prev => ({ ...prev, maxPrice: Number(e.target.value) }))}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600 mt-1">
                <span>$20</span>
                <span>${localFilters.maxPrice}</span>
                <span>$100+</span>
              </div>
            </div>

            {/* Availability */}
            <div>
              <h4 className="font-medium mb-3">Availability</h4>
              <select
                value={localFilters.availability}
                onChange={(e) => setLocalFilters(prev => ({ ...prev, availability: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All Tutors</option>
                <option value="available">Available Now</option>
                <option value="busy">Busy</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-8">
            <button
              onClick={handleClearFilters}
              className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
            >
              Clear All
            </button>
            <button
              onClick={handleApplyFilters}
              className="flex-1 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main TutorSearchPage Component
const TutorSearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy] = useState('rating'); // default sorting; no dropdown in header
  const [filters, setFilters] = useState({
    subjects: [],
    minRating: 0,
    maxPrice: 100,
    availability: 'all'
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const tutorsPerPage = 6;

  // Filter and sort tutors
  const filteredAndSortedTutors = useMemo(() => {
    let filtered = mockTutors.filter(tutor => {
      // Search query filter
      const matchesSearch = searchQuery === '' || 
        tutor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tutor.subjects.some(subject => 
          subject.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        tutor.bio.toLowerCase().includes(searchQuery.toLowerCase());

      // Subject filter
      const matchesSubjects = filters.subjects.length === 0 ||
        filters.subjects.some(subject => tutor.subjects.includes(subject));

      // Rating filter
      const matchesRating = tutor.rating >= filters.minRating;

      // Price filter
      const matchesPrice = tutor.hourlyRate <= filters.maxPrice;

      // Availability filter
      const matchesAvailability = filters.availability === 'all' ||
        (filters.availability === 'available' && tutor.availability === 'Available') ||
        (filters.availability === 'busy' && tutor.availability === 'Busy');

      return matchesSearch && matchesSubjects && matchesRating && matchesPrice && matchesAvailability;
    });

    // Sort tutors (default by rating desc)
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'price-low':
          return a.hourlyRate - b.hourlyRate;
        case 'price-high':
          return b.hourlyRate - a.hourlyRate;
        case 'experience':
          return parseInt(b.experience) - parseInt(a.experience);
        case 'reviews':
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
  const paginatedTutors = filteredAndSortedTutors.slice(startIndex, startIndex + tutorsPerPage);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters, sortBy]);

  // Simulate loading for infinite scroll/pagination
  const handleLoadMore = useCallback(() => {
    if (currentPage < totalPages) {
      setIsLoading(true);
      setTimeout(() => {
        setCurrentPage(prev => prev + 1);
        setIsLoading(false);
      }, 500);
    }
  }, [currentPage, totalPages]);

  const handleContactTutor = (tutor) => {
    alert(`Viewing profile for ${tutor.name}...`);
  };

  const handleClearFilters = () => {
    setFilters({
      subjects: [],
      minRating: 0,
      maxPrice: 100,
      availability: 'all'
    });
    setSearchQuery('');
  };

  const activeFiltersCount = filters.subjects.length + 
    (filters.minRating > 0 ? 1 : 0) + 
    (filters.maxPrice < 100 ? 1 : 0) + 
    (filters.availability !== 'all' ? 1 : 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Search/Filters above centered H1 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Controls row */}
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
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

            {/* Filter Button - visible on all sizes */}
            <button
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
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

          {/* Centered H1 */}
          <h1 className="font-heading font-bold text-3xl text-accent text-center">
            Top Tutors in Chem
          </h1>
        </div>
      </div>

      {/* Main body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-sm text-gray-600">Active filters:</span>
            {filters.subjects.map(subject => (
              <span
                key={subject}
                className="filter-badge px-3 py-1 bg-primary/10 text-primary rounded-full text-sm flex items-center gap-1"
              >
                {subject}
                <button
                  onClick={() => setFilters(prev => ({
                    ...prev,
                    subjects: prev.subjects.filter(s => s !== subject)
                  }))}
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
            {filters.availability !== 'all' && (
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                {filters.availability === 'available' ? 'Available' : 'Busy'}
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
              {paginatedTutors.map(tutor => (
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
                    {isLoading ? 'Loading...' : 'Load More Tutors'}
                  </button>
                )}
                <div className="text-sm text-gray-600">
                  Showing {Math.min(currentPage * tutorsPerPage, filteredAndSortedTutors.length)} of {filteredAndSortedTutors.length} tutors
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Filter Panel - works on all screen sizes */}
      <FilterPanel
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={handleClearFilters}
      />
    </div>
  );
};



export default TutorSearchPage;
