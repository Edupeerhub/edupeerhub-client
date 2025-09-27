import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { Link, useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { bookSession } from "../../lib/api/common/bookingApi";
import { handleToastError } from "../../utils/toastDisplayHandler";
import { useStudentBooking } from "../../hooks/student/useStudentBooking";
import {
  BookingDetailRow,
  SlotButton,
} from "../../components/student/StudentBooking";

function calculateDuration(start, end) {
  if (!start || !end) return null;
  const diff = (new Date(end) - new Date(start)) / 1000 / 60;
  if (diff <= 0) return null;
  const hrs = Math.floor(diff / 60),
    mins = diff % 60;
  return hrs && mins
    ? `${hrs} hr ${mins} min`
    : hrs
    ? `${hrs} hr`
    : `${mins} min`;
}

export default function BookingSession() {
  const { id } = useParams();
  const [date, setDate] = useState(null);
  const [subject, setSubject] = useState("");
  const [step, setStep] = useState(1);
  const [selectedSlotId, setSelectedSlotId] = useState(null);

  const { tutorProfile, tutorLoading, tutorError, availableTimes } =
    useStudentBooking(id, date);

  const bookingMutation = useMutation({
    mutationFn: bookSession,
    onSuccess: () => setStep(3),
    onError: handleToastError,
  });

  const selectedSlot = availableTimes.find((s) => s.id === selectedSlotId);
  const selectedSubjectName = tutorProfile?.subjects?.find(
    (s) => s.id === Number(subject)
  )?.name;

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Step 1 */}
      {step === 1 && (
        <>
          <div className="flex-shrink-0 mb-3">
            <h1 className="text-xl font-bold">Select a Time</h1>
          </div>

          <div className="flex-1 flex flex-col lg:flex-row gap-4 min-h-0">
            {/* Left side - Subject and Calendar */}
            <div className="lg:w-1/2 flex flex-col min-h-0">
              <div className="flex-shrink-0 mb-3">
                <h3 className="text-sm font-medium mb-2">Select Subject</h3>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-2 py-1.5 text-sm border rounded"
                >
                  <option value="">-- Choose a subject --</option>
                  {tutorLoading && (
                    <option disabled>Loading subjects...</option>
                  )}
                  {tutorError && (
                    <option disabled>Failed to load subjects</option>
                  )}
                  {tutorProfile?.subjects?.map((subj) => (
                    <option key={subj.id} value={subj.id}>
                      {subj.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1 flex justify-center items-start overflow-hidden">
                <div className="scale-75 lg:scale-90">
                  <DayPicker
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded"
                  />
                </div>
              </div>
            </div>

            {/* Right side - Time slots */}
            <div className="lg:w-1/2 flex flex-col min-h-0">
              <div className="flex-shrink-0 mb-2">
                <h3 className="text-sm font-medium">Available Times</h3>
              </div>

              <div className="flex-1 overflow-y-auto">
                {availableTimes.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-8">
                    {date ? "No available times" : "Select a date first"}
                  </p>
                ) : (
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                    {availableTimes.map((slot) => (
                      <SlotButton
                        key={slot.id}
                        slot={slot}
                        selected={selectedSlotId === slot.id}
                        onClick={setSelectedSlotId}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex-shrink-0 flex justify-center mt-3">
            <button
              disabled={!date || !subject || !selectedSlotId}
              onClick={() => setStep(2)}
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
            >
              Continue
            </button>
          </div>
        </>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <>
          <div className="flex-shrink-0 mb-4">
            <h1 className="text-xl font-bold text-center">
              Confirm Your Booking
            </h1>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4">
            <div className="flex gap-3 bg-white p-3 rounded border">
              <img
                src={tutorProfile.user.profileImageUrl}
                alt="Tutor"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold text-sm">
                  {tutorProfile.user.firstName} {tutorProfile.user.lastName}
                </p>
                <p className="text-xs text-gray-500">{selectedSubjectName}</p>
              </div>
            </div>

            <div className="space-y-2">
              <BookingDetailRow label="Date" value={date?.toDateString()} />
              <BookingDetailRow
                label="Time"
                value={selectedSlot && `${selectedSlot.label}`}
              />
              <BookingDetailRow
                label="Duration"
                value={
                  selectedSlot &&
                  calculateDuration(selectedSlot.start, selectedSlot.end)
                }
              />
              <BookingDetailRow label="Mode" value="Online Session" />
            </div>
          </div>

          <div className="flex-shrink-0 flex justify-center gap-6 mt-4">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 border rounded bg-gray-100"
            >
              Back
            </button>
            <button
              onClick={() =>
                bookingMutation.mutate({
                  bookingId: selectedSlotId,
                  subjectId: Number(subject),
                })
              }
              disabled={
                !selectedSlotId || !subject || bookingMutation.isLoading
              }
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
            >
              {bookingMutation.isLoading ? "Booking..." : "Confirm Booking"}
            </button>
          </div>
        </>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <div className="px-3">
          <div className="flex-shrink-0 mb-4 ">
            <h1 className="text-xl font-bold text-center">
              Booking Confirmed!
            </h1>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4">
            <div className="flex items-center gap-3 bg-white p-3 rounded border">
              <img
                src={tutorProfile.user.profileImageUrl}
                alt="Tutor"
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold">Online Session</p>
                <p className="text-sm text-gray-500">{selectedSubjectName}</p>
                <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-gray-100 rounded">
                  {tutorProfile.user.firstName} {tutorProfile.user.lastName}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <BookingDetailRow label="Date" value={date?.toDateString()} />
              <BookingDetailRow
                label="Time"
                value={selectedSlot && `${selectedSlot.label}`}
              />
              <BookingDetailRow
                label="Duration"
                value={
                  selectedSlot &&
                  calculateDuration(selectedSlot.start, selectedSlot.end)
                }
              />
              <BookingDetailRow label="Mode" value="Online Session" />
            </div>

            <div className="bg-blue-50 p-3 rounded text-sm">
              <p className="text-blue-800">
                Your booking session with {tutorProfile.user.firstName}{" "}
                {tutorProfile.user.lastName} is confirmed. You will receive a
                reminder 24 hours before the session.
              </p>
            </div>
          </div>

          <div className="flex-shrink-0 space-y-2 mt-4">
            <Link
              to="/student/dashboard"
              className="block w-full px-4 py-2 bg-blue-600 text-white rounded text-center"
            >
              Go to My Dashboard
            </Link>
            <button
              onClick={() => {
                setDate(null);
                setSubject("");
                setSelectedSlotId(null);
                setStep(1);
              }}
              className="w-full px-4 py-2 border rounded bg-gray-100"
            >
              Book Another Session
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
