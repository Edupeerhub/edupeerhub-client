import React from "react";

const FAQ = () => {
  return (
    <section className="w-full py-20 text-center">
      <h1 className="text-3xl font-semibold mb-10">
        Frequently Asked Questions
      </h1>
      <div className="max-w-2xl mx-auto space-y-6">
        <details className="bg-blue-100 rounded-lg shadow p-4">
          <summary className="cursor-pointer font-semibold">
            How do I become a tutor?
          </summary>
          <p className="mt-2 text-gray-700">
            Simply sign up and complete the tutor application form.
          </p>
        </details>
        <details className="bg-blue-100 rounded-lg shadow p-4">
          <summary className="cursor-pointer font-semibold">
            Is it free for students?
          </summary>
          <p className="mt-2 text-gray-700">
            Yes! EduPeerHub is completely free for all students.
          </p>
        </details>
        <details className="bg-blue-100 rounded-lg shadow p-4">
          <summary className="cursor-pointer font-semibold">
            Can I volunteer part-time?
          </summary>
          <p className="mt-2 text-gray-700">
            Absolutely. You choose your availability and schedule.
          </p>
        </details>
      </div>
    </section>
  );
};

export default FAQ;
