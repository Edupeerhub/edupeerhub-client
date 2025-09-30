import {
  AlertCircle,
  Calendar1Icon,
  ChevronRight,
  CalendarSyncIcon,
} from "lucide-react";

export default function ApprovedLayout({ rating }) {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border shadow p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center">
              <StudentIcon />
            </div>
            {/* <ChevronRight className="w-4 h-4 text-gray-400" /> */}
          </div>
          <p className="text-sm text-gray-600">Total Students</p>
          <p className="text-2xl font-bold">0</p>
        </div>

        <div className="bg-white rounded-lg border shadow p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-fullflex items-center justify-center">
              <CalendarSyncIcon />
            </div>
            {/* <ChevronRight className="w-4 h-4 text-gray-400" /> */}
          </div>
          <p className="text-sm text-gray-600">Weekly Sessions</p>
          <p className="text-2xl font-bold">0</p>
        </div>

        <div className="bg-white rounded-lg border shadow p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center">
              <RatingsIcon />
            </div>
            {/* <ChevronRight className="w-4 h-4 text-gray-400" /> */}
          </div>
          <p className="text-sm text-gray-600">Ratings</p>
          <p className="text-2xl font-bold">{rating}</p>
        </div>
      </div>

      {/* Booking Requests */}
      <div className="bg-white rounded-lg border shadow p-4">
        <h2 className="text-lg font-semibold mb-4">Booking Requests</h2>
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <Calendar1Icon className="w-8 h-8 text-primary" />
          </div>
          <div className="text-center max-w-md">
            <h3 className="text-lg font-semibold mb-2">
              No booking requests yet
            </h3>
            <p className="text-gray-600 text-sm">
              Your requests will appear here once students start booking
              sessions with you
            </p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border shadow p-4">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <div className="flex items-center gap-3 p-3 border rounded-lg">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm">You do not have any recent activities</p>
          </div>
        </div>
      </div>
    </div>
  );
}
