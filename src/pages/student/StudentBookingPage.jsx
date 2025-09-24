import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

import TutorImage from "../../assets/booking/tutor.svg";
import CheckIcon from "../../assets/booking/check.svg";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getTutorProfile } from "../../lib/api/tutor/tutorApi";
import { fetchStudentTutorAvailability } from "../../lib/api/common/bookingApi";

function calculateDuration(start, end) {
  if (!start || !end) return null;

  const parseTime = (time) => {
    const [hours, minutesPart] = time.split(":");
    let [minutes, meridian] = minutesPart.split(" ");
    let hrs = parseInt(hours, 10);
    let mins = parseInt(minutes, 10);

    if (meridian === "PM" && hrs !== 12) hrs += 12;
    if (meridian === "AM" && hrs === 12) hrs = 0;

    return hrs * 60 + mins;
  };

  const startMinutes = parseTime(start);
  const endMinutes = parseTime(end);
  const diff = endMinutes - startMinutes;

  if (diff <= 0) return null;

  const hrs = Math.floor(diff / 60);
  const mins = diff % 60;

  return hrs > 0 && mins > 0
    ? `${hrs} hr ${mins} min`
    : hrs > 0
    ? `${hrs} hr`
    : `${mins} min`;
}

export default function BookingSession() {
  const { id } = useParams();

  const [date, setDate] = useState(null);
  const [time, setTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [subject, setSubject] = useState("");
  const [step, setStep] = useState(1);
  // state should store the ID, not just the time string
  const [selectedStartId, setSelectedStartId] = useState(null);
  const [selectedEndId, setSelectedEndId] = useState(null);

  const {
    data: tutorProfile,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tutorProfile", id],
    queryFn: () => getTutorProfile(id),
    enabled: !!id,
  });

  let start = null;
  let end = null;

  if (date) {
    // Start of day UTC
    start = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0)
    ).toISOString();

    // End of day UTC
    end = new Date(
      Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        23,
        59,
        59,
        999
      )
    ).toISOString();
  }

  const { data: availabilityData, isLoading: availabilityLoading } = useQuery({
    queryKey: ["availability", id, start, end],
    queryFn: () =>
      fetchStudentTutorAvailability({
        tutorId: id,
        start,
        end,
      }),
    enabled: !!id && !!start && !!end, // only run if tutorId & date are set
  });

  // Process available slots
  const availableTimes =
    availabilityData?.map((slot) => ({
      id: slot.id, // safe fallback
      start: slot.scheduledStart, // raw ISO
      end: slot.scheduledEnd, // raw ISO
      startLabel: new Date(slot.scheduledStart).toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      }),
      endLabel: new Date(slot.scheduledEnd).toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      }),
    })) || [];

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-4">
      {/* Step 1 */}
      {step === 1 && (
        <div className="w-full max-w-3xl flex flex-col">
          <h1 className="text-2xl font-bold mb-3">Select a Time</h1>

          {/* Subject Dropdown */}
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-1">Select Subject</h3>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-2 py-2 border rounded-lg"
            >
              <option value="">-- Choose a subject --</option>

              {/* Loading state */}
              {isLoading && <option disabled>Loading subjects...</option>}

              {/* Error state */}
              {error && <option disabled>Failed to load subjects</option>}

              {/* Fetched subjects */}
              {tutorProfile?.subjects &&
                tutorProfile?.subjects.map((subj) => (
                  <option key={subj.id} value={subj.id}>
                    {subj.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Calendar */}
          <div className="flex justify-center mb-4">
            <DayPicker
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-lg p-4"
            />
          </div>

          {/* Time Selection */}
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-1">Select Time</h3>

            {availabilityLoading && <p>Loading available times...</p>}
            {!availabilityLoading && availableTimes.length === 0 && (
              <p className="text-gray-500">No available times for this date</p>
            )}

            {availableTimes.length > 0 && (
              <div className="flex gap-4">
                {/* Start Time */}
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Start Time</p>
                  <div className="flex flex-wrap gap-2">
                    {availableTimes.map((slot) => (
                      <button
                        key={slot.id}
                        onClick={() => setSelectedStartId(slot.id)}
                        className={`px-3 py-1 rounded-lg border ${
                          selectedStartId === slot.id
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100"
                        }`}
                      >
                        {slot.startLabel}
                      </button>
                    ))}
                  </div>
                </div>

                {/* End Time */}
                <div className="flex-1">
                  <p className="text-sm text-gray-500">End Time</p>
                  <div className="flex flex-wrap gap-2">
                    {availableTimes.map((slot) => (
                      <button
                        key={slot.id + "-end"}
                        onClick={() => setSelectedEndId(slot.id)}
                        className={`px-3 py-1 rounded-lg border ${
                          selectedEndId === slot.id
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100"
                        }`}
                      >
                        {slot.endLabel}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-center md:justify-end mt-2 sm:mt-4 md:mt-2">
            <button
              disabled={!date || !time || !endTime || !subject}
              onClick={() => setStep(2)}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Confirmation */}
      {step === 2 && (
        <div className="flex-1 flex flex-col w-full px-4 sm:px-6 lg:pl-20 lg:pr-10">
          <header className="mb-6 sm:mb-10">
            <h1 className="text-2xl font-semibold">Confirm Your Booking</h1>
          </header>

          {/* Profile + details */}
          <main className="space-y-10 w-full max-w-4xl">
            <section className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 bg-white p-4 rounded-lg shadow-sm">
              <img
                src={TutorImage}
                alt="Tutor"
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold text-lg">Ms. Adebayo Otedola</p>
                <p className="text-sm text-gray-500">{subject || "-"}</p>
              </div>
            </section>

            {/* Divider */}
            <div className="w-full border-b border-gray-300"></div>

            {/* Booking details */}
            <section className="w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-4 pb-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium text-base">
                    {date ? date.toDateString() : "-"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Time</p>
                  <p className="font-medium text-base">
                    {time || "-"} - {endTime || "-"}
                  </p>
                </div>
              </div>

              <div className="w-full border-b border-gray-300"></div>

              <div className="mt-4">
                <p className="text-sm text-gray-500">Duration</p>
                <p className="font-medium text-base">
                  {calculateDuration(time, endTime) || "-"}
                </p>
              </div>
            </section>
          </main>

          {/* Footer */}
          <footer className="mt-10 sm:mt-20 flex flex-col sm:flex-row w-full max-w-xl gap-4 sm:gap-0 sm:justify-between">
            <button
              onClick={() => setStep(1)}
              className="w-full sm:w-auto px-6 py-2 border rounded-lg text-base bg-gray-100"
            >
              Cancel
            </button>

            <button
              onClick={() => setStep(3)}
              className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg text-base"
            >
              Confirm Booking
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
                src={TutorImage}
                alt="Tutor"
                className="w-20 h-20 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold text-lg">Online Session</p>
                <p className="text-sm text-gray-500">{subject || "-"}</p>
                <span className="mt-1 inline-block px-2 py-0.5 text-xs bg-gray-100 rounded">
                  Adebayo Lawal
                </span>
              </div>
            </section>

            {/* Booking details */}
            <section className="space-y-8">
              <div className="flex items-start gap-12">
                <p className="text-sm text-gray-500 w-24">Date</p>
                <p className="font-medium">
                  {date ? date.toDateString() : "-"}
                </p>
              </div>

              <div className="flex items-start gap-12">
                <p className="text-sm text-gray-500 w-24">Time</p>
                <p className="font-medium">
                  {time || "-"} - {endTime || "-"}
                </p>
              </div>

              <div className="flex items-start gap-12">
                <p className="text-sm text-gray-500 w-24">Duration</p>
                <p className="font-medium">
                  {calculateDuration(time, endTime) || "-"}
                </p>
              </div>

              <div className="flex items-start gap-12">
                <p className="text-sm text-gray-500 w-24">Mode</p>
                <p className="font-medium">Online Session</p>
              </div>
            </section>

            <p className="text-sm text-gray-600">
              Your booking session with Ms. Adebayo Lawal is confirmed. You will
              receive a reminder 24 hours before the session.
            </p>
          </main>

          {/* Footer */}
          <footer className="mt-16 flex flex-col items-center gap-4 w-full">
            <button className="w-full max-w-md px-5 py-2 bg-blue-600 text-white rounded-lg">
              Go to My Dashboard
            </button>

            <button
              onClick={() => {
                setDate(null);
                setTime("");
                setEndTime("");
                setSubject("");
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
