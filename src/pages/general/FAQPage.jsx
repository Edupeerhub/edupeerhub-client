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
        "A rate refers to the amount you pay per tutoring session. This can vary depending on the tutor's expertise and subject.",
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
      question: "What are EduPeerhub's goals?",
      answer:
        "EduPeerhub's mission is to make learning accessible, personalized, and engaging by connecting students with the right tutors.",
    },
  ];

  return (
    <div className=" bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-2 md:p-6 relative">
      {/* Header */}
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold flex items-center justify-center gap-2 mb-3">
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Hello User
            </span>
            <img src={handWaving} alt="wave" className="w-8 h-8" />
          </h2>
          <p className="text-gray-600 text-lg font-medium">
            How can we help you today?
          </p>
        </div>

        {/* FAQs */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="group border border-gray-200 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex justify-between items-center px-4 py-4 text-left text-gray-800 font-semibold hover:bg-blue-50/50 transition-colors duration-200"
              >
                <span className="text-base leading-normal pr-3">
                  {faq.question}
                </span>
                <div className="flex-shrink-0">
                  <img
                    src={dropDown}
                    alt="toggle"
                    className={`w-5 h-5 transform transition-all duration-300 ${
                      openIndex === index
                        ? "rotate-180 text-blue-600"
                        : "group-hover:scale-110"
                    }`}
                  />
                </div>
              </button>

              {openIndex === index && (
                <div className="px-4 pb-4 text-gray-600 text-sm leading-normal animate-fadeIn border-t border-gray-100">
                  <div className="pt-3">{faq.answer}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Button */}
      <button className="fixed bottom-6 right-2 flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full shadow-xl px-4 py-3 hover:from-blue-700 hover:to-blue-800 hover:scale-105 transition-all duration-300 group">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 group-hover:bg-white/30 transition-colors">
          <img
            src={chatDots}
            alt="chat"
            className="w-6 h-6 text-white filter brightness-0 invert"
          />
        </div>
        <span className="hidden sm:inline text-white font-medium text-sm">
          Start up a chat with our team of experts!
        </span>
      </button>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default FAQPage;
