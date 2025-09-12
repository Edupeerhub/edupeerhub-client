import React from "react";
import { Link } from "react-router-dom";

const Journey = () => {
  return (
    <section className="w-4/5 mx-auto py-16 text-center border border-gray-800 rounded-lg bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">Start Your Journey</h1>
      <p className="text-gray-300 mb-8">
        Become part of our mission to make education accessible to all.
      </p>
      <Link
        to="/signup"
        className="bg-blue-400 text-gray-900 px-6 py-3 rounded hover:bg-white hover:text-black transition"
      >
        Get Started
      </Link>
    </section>
  );
};

export default Journey;
