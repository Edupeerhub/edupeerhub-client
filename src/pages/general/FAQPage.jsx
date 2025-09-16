import React, { useState } from "react";

import handWaving from "../../assets//Faq/hand-waving.svg";
import dropDown from "../../assets/Faq/drop-down.svg";
import chatDots from "../../assets/Faq/chat-dots.svg";

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "Frequently Asked Questions - FAQs",
      answer:
        "EduPeerhub provides answers to the most common questions about our platform, tutors, and learning experience.",
    },
    {
      question: "What Is A Rate?",
      answer:
        "A rate refers to the amount you pay per tutoring session. This can vary depending on the tutor’s expertise and subject.",
    },
    {
      question: "Can I Reschedule A Booking?",
      answer:
        "Yes, you can reschedule a booking from your dashboard at least 24 hours before the session begins.",
    },
    {
      question: "Are The EduPeerhub Tutors Qualified?",
      answer:
        "All EduPeerhub tutors are carefully vetted, experienced, and qualified in their respective fields to provide the best learning experience.",
    },
    {
      question: "How Do I Sign Up As A Tutor?",
      answer:
        "You can sign up as a tutor by clicking the 'Become a Tutor' button on the homepage and completing the application process.",
    },
    {
      question: "What are EduPeerhub’s goals?",
      answer:
        "EduPeerhub’s mission is to make learning accessible, personalized, and engaging by connecting students with the right tutors.",
    },
  ];

  return (
    <div className="p-6 relative">
      {/* Header */}
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <span className="text-green-600">Hello User</span>
        <img src={handWaving} alt="wave" className="w-14 h-14" />
      </h2>
      <p className="text-gray-700 text-lg font-semibold mt-2">
        How can we help you, today?
      </p>

      {/* FAQs */}
      <div className="mt-6 space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border rounded-lg bg-white shadow-sm"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex justify-between items-center px-4 py-3 text-left text-gray-800 font-medium"
            >
              <span>{faq.question}</span>
              <img
                src={dropDown}
                alt="toggle"
                className={`w-5 h-5 transform transition-transform ${
                  openIndex === index ? "rotate-180" : ""
                }`}
              />
            </button>

            {openIndex === index && (
              <div className="px-4 pb-4 text-gray-600">{faq.answer}</div>
            )}
          </div>
        ))}
      </div>

       {/* Chat Button */}
      <button className="fixed bottom-6 left-1/2 -translate-x-1/2 sm:left-auto sm:right-6 flex items-center gap-2 bg-[#0568FF] rounded-3xl shadow-lg px-4 py-2 hover:scale-105 transition">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#0568FF]">
          <img src={chatDots} alt="chat" className="w-8 h-8 text-white" />
        </div>
        <span className="hidden sm:inline text-gray-800 font-medium">
          Start up a chat with our team of experts!
        </span>
      </button>
    </div>
  );
};

export default FAQPage;
