import { useState } from "react";
import useAuthUser from "../../hooks/auth/useAuthUser";

const StudentDashboardPage = () => {
  const { authUser } = useAuthUser();

  return (
    <>
      <div className="flex h-full items-center justify-center ">
        <div className="w-64 h-20 bg-blue-500 text-center font-semibold flex items-center justify-center ">
          Welcome student, {authUser.firstName}
        </div>
      </div>
      {/* <div className="space-y-6">
        {Array.from({ length: 50 }).map((_, i) => (
          <div key={i} className="h-24 bg-blue-500 rounded" />
        ))}
      </div> */}
    </>
  );
};

export default StudentDashboardPage;
