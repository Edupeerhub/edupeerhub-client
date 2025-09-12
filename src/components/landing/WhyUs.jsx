import React from "react";

const WhyUs = () => {
  return (
    <section className="w-4/5 mx-auto py-20 text-center">
      <h1 className="text-3xl font-semibold mb-10">Why Choose Us?</h1>
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1 border border-blue-400 bg-blue-400 rounded-lg p-6 text-left hover:shadow-xl transition">
          <p className="text-white text-lg">
            We provide affordable and accessible peer tutoring to bridge
            learning gaps.
          </p>
        </div>
        <div className="flex-1">
          <img src="/Frame 16.png" alt="Why Us" className="w-full max-w-md" />
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
