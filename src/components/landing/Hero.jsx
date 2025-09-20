import React from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between px-6 pt-32 pb-16 bg-gradient-to-b from-white to-blue-200">
      <div className="max-w-xl space-y-6 text-left">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          <span className="text-blue-400">Peer</span> Tutoring that Bridges the
          Education Gap
        </h1>
        <p className="text-lg text-gray-700">
          Join a movement of students and volunteers working together to make
          learning free, fun, and fair.
        </p>
        <div className="flex space-x-4">
          <Link
            to="/signup"
            className="bg-blue-400 text-white px-6 py-3 rounded hover:bg-blue-500"
          >
            Become a Tutor
          </Link>
          <Link
            to="/signup"
            className="border border-blue-400 text-blue-400 px-6 py-3 rounded hover:bg-blue-400 hover:text-white"
          >
            Join as a Student
          </Link>
        </div>
      </div>
      <div className="mt-10 md:mt-0">
        <img
          src="/Frame 15.png"
          alt="Hero Illustration"
          className="max-h-96 "
        />
      </div>
    </section>
  );
};

export default Hero;
