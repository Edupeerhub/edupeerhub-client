import React, { useState, useEffect } from "react";
import { 
  ArrowLeft,
  Upload,
  Calendar,
  Clock,
  MapPin,
  Mail,
  Phone,
  GraduationCap
} from "lucide-react";

const AdminTutorsPage = () => {
  const [loading, setLoading] = useState(true);
  const [tutor, setTutor] = useState(null);

  // Mock tutor data - replace with actual API call
  useEffect(() => {
    const mockTutor = {
      id: 1,
      name: "Mr. Ola Williams",
      email: "ola.williams@email.com",
      phone: "08123456789",
      institution: "University of Lagos",
      subjects: ["Mathematics", "Physics", "Calculus"],
      bio: "Iam a dedicated tutor with 5+ years of experience, specializing in Mathematics and Further Math.My goal is to make learning engaging and effective, helping students build confidence and achieve their academic goals.",
      profileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face",
      availability: {
        days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        timeSlots: [
          { day: "Monday", times: ["9:00 AM - 12:00 PM", "2:00 PM - 5:00 PM"] },
          { day: "Tuesday", times: ["10:00 AM - 1:00 PM", "3:00 PM - 6:00 PM"] },
          { day: "Wednesday", times: ["9:00 AM - 12:00 PM", "2:00 PM - 5:00 PM"] },
          { day: "Thursday", times: ["10:00 AM - 1:00 PM", "3:00 PM - 6:00 PM"] },
          { day: "Friday", times: ["9:00 AM - 12:00 PM"] }
        ]
      },
      rating: 4.8,
      totalStudents: 45,
      joinDate: "2023-01-15",
      status: "pending",
      verified: false
    };

    // Simulate API loading
    setTimeout(() => {
      setTutor(mockTutor);
      setLoading(false);
    }, 1000);
  }, []);

  const handleBack = () => {
    // Navigate back to tutors list
    console.log("Navigate back to tutors list");
  };

  const handleUploadResume = () => {
    // Handle resume upload
    console.log("Upload resume");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-spinner"></div>
        <span className="ml-2 text-gray-600">Loading tutor profile...</span>
      </div>
    );
  }

  if (!tutor) {
    return (
      <div className="p-6 bg-background min-h-screen">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Tutor not found</h3>
          <p className="text-gray-500 mb-4">The tutor profile you're looking for doesn't exist.</p>
          <button 
            onClick={handleBack}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Back to Tutors
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-background min-h-screen">
      {/* Header with Back Button */}
      <div className="mb-6">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors mb-4"
        >
          <ArrowLeft size={20} />
          Back
        </button>
        
        <div>
          <h2 className="text-2xl font-bold text-accent">Tutor Profile Review</h2>
          <p className="text-sm text-gray-600 mt-1">Application Date: January 15, 2024</p>
        </div>
      </div>

      {/* Tutor Profile Card */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Profile Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start gap-6">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              <img
                src={tutor.profileImage}
                alt={tutor.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
              />
            </div>
            
            {/* Basic Info */}
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-accent mb-2">{tutor.name}</h3>
              
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <GraduationCap size={16} />
                <span>{tutor.institution}</span>
              </div>
              
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Mail size={16} />
                <span>{tutor.email}</span>
              </div>
              
              <div className="flex items-center gap-2 text-gray-600 mb-4">
                <Phone size={16} />
                <span>{tutor.phone}</span>
              </div>

              {/* Subjects */}
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
          </div>
        </div>

        {/* Details Section */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-accent mb-4">Details</h3>
          
          {/* Bio */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Biography</h4>
            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
              <p className="text-gray-700 leading-relaxed">{tutor.bio}</p>
            </div>
          </div>

          {/* Availability */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Availability</h4>
            
            {/* Available Days */}
            <div className="mb-4">
              <h5 className="text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">Available Days</h5>
              <div className="flex flex-wrap gap-2">
                {tutor.availability.days.map((day, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                  >
                    {day}
                  </span>
                ))}
              </div>
            </div>

            {/* Time Slots */}
            <div>
              <h5 className="text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">Time Slots</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {tutor.availability.timeSlots.map((slot, index) => (
                  <div key={index} className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar size={14} className="text-gray-500" />
                      <span className="font-medium text-sm text-gray-900">{slot.day}</span>
                    </div>
                    <div className="space-y-1">
                      {slot.times.map((time, timeIndex) => (
                        <div key={timeIndex} className="flex items-center gap-2">
                          <Clock size={12} className="text-gray-400" />
                          <span className="text-xs text-gray-600">{time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Resume Section */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Resume</h4>
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">resume.pdf</p>
                  <p className="text-xs text-gray-500">Uploaded 2 days ago • 245 KB</p>
                </div>
              </div>
              <button
                onClick={() => console.log('View resume')}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
              >
                View
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Approve Tutor
            </button>
            <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              Reject Tutor
            </button>
            <button className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
              Request More Info
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTutorsPage;