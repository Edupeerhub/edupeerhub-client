import useAuthUser from "../../hooks/auth/useAuthUser";

const TutorDashboardPage = () => {
  const { authUser } = useAuthUser();

  return (
    <div className="flex h-full items-center justify-center ">
      <div className="w-64 h-20 bg-blue-500 text-center font-semibold flex items-center justify-center ">
        Welcome tutor, {authUser?.firstName}
      </div>
    </div>
  );
};

export default TutorDashboardPage;
