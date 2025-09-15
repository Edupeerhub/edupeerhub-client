import React from 'react';
import StudentTutorsPage from './StudentTutorsPage';

// Example usage of the TutorSearchPage component
const StudentTutorsPage = () => {
  // Custom handler for when a user contacts a tutor
  const handleTutorContact = (tutor) => {
    console.log('Contacting tutor:', tutor);
    
    // Example: Open a modal, navigate to contact page, or send a message
    alert(`Initiating contact with ${tutor.name}!\n\nIn a real app, this would:\n- Open a messaging interface\n- Navigate to tutor profile\n- Start a booking flow\n- Send a notification`);
    
    // You could also:
    // - Navigate to a contact form: navigate(`/contact/${tutor.id}`)
    // - Open a modal: setContactModalOpen(true)
    // - Send analytics: trackEvent('tutor_contact_initiated', { tutorId: tutor.id })
  };

  // Example with custom initial state
  const handleTutorContactWithBooking = (tutor) => {
    // Example: Direct booking flow
    const bookingData = {
      tutorId: tutor.id,
      tutorName: tutor.name,
      subjects: tutor.subjects,
      hourlyRate: tutor.hourlyRate,
      timestamp: new Date().toISOString()
    };
    
    console.log('Starting booking flow:', bookingData);
    
    // In a real app, you might:
    // - Save to localStorage for booking flow
    // - Navigate to booking page with tutor data
    // - Open booking modal
    // - Send to booking API
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation or header could go here */}
      <nav className="bg-white shadow-sm border-b p-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-xl font-bold text-gray-900">EduPeerHub - Find Tutors</h1>
        </div>
      </nav>

      {/* Main tutor search interface */}
      <StudentTutorsPage />

      {/* You could also pass custom props: */}
      {/* 
      <StudentTutorsPage
        onTutorContact={handleTutorContactWithBooking}
        initialFilters={{
          subjects: ['Mathematics'],
          minRating: 4.5,
          availability: 'available'
        }}
        tutorsPerPage={8}
        showCompactCards={false}
      />
      */}
    </div>
  );
};

// Alternative example with custom filtering
const TutorSearchWithCustomFilters = () => {
  const [customFilters, setCustomFilters] = React.useState({
    subjects: ['Computer Science', 'Programming'],
    minRating: 4.0,
    maxPrice: 60,
    availability: 'available'
  });

  const handleFilterChange = (newFilters) => {
    setCustomFilters(newFilters);
    // You could also sync with URL params or save to localStorage
    console.log('Filters changed:', newFilters);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Find Programming Tutors</h1>
        
        {/* Custom filter controls could go here */}
        <div className="mb-6 p-4 bg-white rounded-lg shadow-sm">
          <h2 className="font-semibold mb-2">Quick Filters</h2>
          <div className="flex gap-2 flex-wrap">
            <button 
              onClick={() => setCustomFilters(prev => ({ ...prev, subjects: ['Computer Science'] }))}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200"
            >
              Computer Science Only
            </button>
            <button 
              onClick={() => setCustomFilters(prev => ({ ...prev, maxPrice: 40 }))}
              className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm hover:bg-green-200"
            >
              Under #500/hr
            </button>
            <button 
              onClick={() => setCustomFilters(prev => ({ ...prev, minRating: 4.8 }))}
              className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm hover:bg-yellow-200"
            >
              Top Rated (4.8+)
            </button>
          </div>
        </div>

        <StudentTutorsPage 
          initialFilters={customFilters}
          onFiltersChange={handleFilterChange}
        />
      </div>
    </div>
  );
};

// Example for integration with React Router
const TutorSearchWithRouting = () => {
  // This would work with React Router
  const navigate = useNavigate(); // from react-router-dom
  const location = useLocation();

  const handleTutorContact = (tutor) => {
    // Navigate to tutor profile page
    navigate(`/tutors/${tutor.id}`, { 
      state: { 
        tutor,
        returnTo: location.pathname 
      }
    });
  };

  const handleTutorBooking = (tutor) => {
    // Navigate to booking page
    navigate(`/book/${tutor.id}`, {
      state: { tutor }
    });
  };

  return (
    <StudentTutorsPage 
      onTutorContact={handleTutorContact}
      onTutorBook={handleTutorBooking}
    />
  );
};

export default TutorSearchExample;
export { TutorSearchWithCustomFilters, TutorSearchWithRouting }; 