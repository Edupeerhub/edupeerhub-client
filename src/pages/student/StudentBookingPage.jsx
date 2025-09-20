import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

import TutorImage from "../../assets/booking/tutor.svg";
import CheckIcon from "../../assets/booking/check.svg";

const times = [
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM",
];

export default function BookingSession() {
  const [date, setDate] = useState(null);
  const [time, setTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [step, setStep] = useState(1); 

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-4">
      {/* Step 1 */}
      {step === 1 && (
        <div className="w-full max-w-3xl">
          <h1 className="text-2xl font-bold mb-6">Select a Time</h1>

          {/* Calendar*/}
          <div className="flex justify-center mb-8">
            <DayPicker
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-lg p-4"
            />
          </div>

          {/* Time Presets */}
          <div className="space-y-8">
            {/* Start Time */}
            <div>
              <h3 className="text-lg font-medium mb-4">Start Time</h3>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {times.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => setTime(slot)}
                    className={`px-4 py-2 rounded-lg border flex items-center justify-center gap-2
                      ${time === slot ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700"}
                    `}
                  >
                    {time === slot && (
                      <img src={CheckIcon} alt="selected" className="w-4 h-4" />
                    )}
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* End Time */}
            <div>
              <h3 className="text-lg font-medium mb-4">End Time</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {times.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => setEndTime(slot)}
                    className={`px-4 py-2 rounded-lg border flex items-center justify-center gap-2
                      ${endTime === slot ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700"}
                    `}
                  >
                    {endTime === slot && (
                      <img src={CheckIcon} alt="selected" className="w-4 h-4" />
                    )}
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-center md:justify-end mt-8">
            <button
              disabled={!date || !time || !endTime}
              onClick={() => setStep(2)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg disabled:opacity-50"
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
             <p className="text-sm text-gray-500">Mathematics</p>
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
             <p className="font-medium text-base">1 hour</p>
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
               <h1 className="text-2xl font-semibold text-center">Booking Confirmed!</h1>
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
                   <p className="text-sm text-gray-500">Mathematics</p>
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
                    <p className="font-medium">2 hours</p>
                 </div>

                 <div className="flex items-start gap-12">
                    <p className="text-sm text-gray-500 w-24">Mode</p>
                    <p className="font-medium">Online Session</p>
                 </div>
               </section>

                <p className="text-sm text-gray-600">
                  Your booking session with Ms. Adebayo Lawal is confirmed. You will receive a reminder
                  24 hours before the session.
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