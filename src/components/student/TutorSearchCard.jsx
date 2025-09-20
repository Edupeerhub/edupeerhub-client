import { BookOpen, Clock, MapPin, Star, Users } from "lucide-react";

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
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium text-sm">{tutor.rating}</span>
              <span className="text-gray-500 text-sm">
                ({tutor.reviewCount})
              </span>
            </div>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                tutor.availability === "Available"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {tutor.availability}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="font-heading font-bold text-xl text-primary">
            ${tutor.hourlyRate}
          </div>
          <div className="text-gray-500 text-sm">per hour</div>
        </div>
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
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{tutor.bio}</p>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>{tutor.location}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Clock className="w-4 h-4" />
          <span>{tutor.experience}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Users className="w-4 h-4" />
          <span>{tutor.totalStudents} students</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <BookOpen className="w-4 h-4" />
          <span>{tutor.completedSessions} sessions</span>
        </div>
      </div>

      {/* Education & Response Time */}
      <div className="mb-4 space-y-1">
        <div className="text-sm text-gray-600">
          <span className="font-medium">Education:</span> {tutor.education}
        </div>
        <div className="text-sm text-gray-600">{tutor.responseTime}</div>
      </div>

      {/* Action Button */}
      <button
        onClick={() => onContact(tutor)}
        className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors duration-200"
      >
        Contact Tutor
      </button>
    </div>
  );
};

export default TutorCard;
