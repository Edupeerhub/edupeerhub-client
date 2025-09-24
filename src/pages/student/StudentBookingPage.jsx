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
    <div className="flex flex-col items-center justify-center gap-6 py-4">
      {/* Step 1 */}
      {step === 1 && (
        <div className="w-full max-w-3xl flex flex-col">
          <h1 className="text-2xl font-bold mb-3">Select a Time</h1>
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-1">Select Subject</h3>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-2 py-2 border rounded-lg"
            >
              <option value="">-- Choose a subject --</option>
              {tutorLoading && <option disabled>Loading subjects...</option>}
              {tutorError && <option disabled>Failed to load subjects</option>}
              {tutorProfile?.subjects?.map((subj) => (
                <option key={subj.id} value={subj.id}>
                  {subj.name}
                </option>
              ))}
            </select>
          </div>

          <DayPicker
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-lg p-4"
          />

          <div className="mb-4">
            <h3 className="text-lg font-medium mb-1">Select Slot</h3>
            {availableTimes.length === 0 && (
              <p className="text-gray-500">No available times</p>
            )}
            <div className="flex flex-wrap gap-2">
              {availableTimes.map((slot) => (
                <SlotButton
                  key={slot.id}
                  slot={slot}
                  selected={selectedSlotId === slot.id}
                  onClick={setSelectedSlotId}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-center md:justify-end mt-2 sm:mt-4">
            <button
              disabled={!date || !subject || !selectedSlotId}
              onClick={() => setStep(2)}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div className="flex-1 flex flex-col w-full px-4 sm:px-6 lg:pl-20 lg:pr-10">
          <header className="mb-6 sm:mb-10">
            <h1 className="text-2xl font-semibold">Confirm Your Booking</h1>
          </header>

          <main className="space-y-10 w-full max-w-4xl">
            <section className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 bg-white p-4 rounded-lg shadow-sm">
              <img
                src={tutorProfile.user.profileImageUrl}
                alt="Tutor"
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold text-lg">
                  {tutorProfile.user.firstName} {tutorProfile.user.lastName}
                </p>
                <p className="text-sm text-gray-500">{selectedSubjectName}</p>
              </div>
            </section>

            <div className="w-full border-b border-gray-300"></div>

            <section className="space-y-4">
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
            </section>
          </main>

          <footer className="mt-10 sm:mt-20 flex flex-col sm:flex-row w-full max-w-xl gap-4 sm:gap-0 sm:justify-between">
            <button
              onClick={() => setStep(1)}
              className="w-full sm:w-auto px-6 py-2 border rounded-lg text-base bg-gray-100"
            >
              Cancel
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
              className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg text-base disabled:opacity-50"
            >
              {bookingMutation.isLoading ? "Booking..." : "Confirm Booking"}
            </button>
          </footer>
        </div>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <div className="flex-1 flex flex-col px-4 md:px-20">
          <header className="mb-10">
            <h1 className="text-2xl font-semibold text-center">
              Booking Confirmed!
            </h1>
          </header>

          <main className="space-y-10">
            <section className="flex items-center gap-6">
              <img
                src={tutorProfile.user.profileImageUrl}
                alt="Tutor"
                className="w-20 h-20 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold text-lg">Online Session</p>
                <p className="text-sm text-gray-500">{selectedSubjectName}</p>
                <span className="mt-1 inline-block px-2 py-0.5 text-xs bg-gray-100 rounded">
                  {tutorProfile.user.firstName} {tutorProfile.user.lastName}
                </span>
              </div>
            </section>

            <section className="space-y-8">
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
            </section>

            <p className="text-sm text-gray-600">
              Your booking session with {tutorProfile.user.firstName}{" "}
              {tutorProfile.user.lastName} is confirmed. You will receive a
              reminder 24 hours before the session.
            </p>
          </main>

          <footer className="mt-16 flex flex-col items-center gap-4 w-full">
            <Link
              to="/student/dashboard"
              className="w-full max-w-md px-5 py-2 bg-blue-600 text-white rounded-lg text-center"
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
              className="w-full max-w-md px-5 py-2 border rounded-lg bg-gray-100"
            >
              Book Another Session
            </button>
          </footer>
        </div>
      )}
    </div>
  );
}
