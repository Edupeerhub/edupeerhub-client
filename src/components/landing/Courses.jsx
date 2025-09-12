import React from "react";

const Courses = () => {
  return (
    <section className="w-4/5 mx-auto py-20 text-center">
      <h1 className="text-3xl font-semibold mb-10">Our Courses</h1>
      <div className="flex flex-col md:flex-row justify-between gap-8">
        <div className="flex-1 border border-blue-400 rounded-lg p-6 hover:shadow-xl transition">
          <h3 className="text-xl font-semibold mb-4">Course One</h3>
          <p className="text-gray-600">
            Brief description of the first course.
          </p>
        </div>
        <div className="flex-1 border border-blue-400 rounded-lg p-6 hover:shadow-xl transition">
          <h3 className="text-xl font-semibold mb-4">Course Two</h3>
          <p className="text-gray-600">
            Brief description of the second course.
          </p>
        </div>
        <div className="flex-1 border border-blue-400 rounded-lg p-6 hover:shadow-xl transition">
          <h3 className="text-xl font-semibold mb-4">Course Three</h3>
          <p className="text-gray-600">
            Brief description of the third course.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Courses;
