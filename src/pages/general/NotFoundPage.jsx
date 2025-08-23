import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();
  const handleGoHome = () => {
    navigate("/");
  };
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center text-center p-4">
      <div className="max-w-md mx-auto">
        {/* 404 Number */}
        <h1
          className="text-6xl md:text-8xl font-bold mb-6"
          style={{ color: "#4CA1F0" }}
        >
          404
        </h1>

        {/* Message */}
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          Oops! The page you were looking for seems to be missing. Maybe it's
          studying somewhere else? 🤔
        </p>

        {/* Home Button */}
        <button
          onClick={handleGoHome}
          className="text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 hover:opacity-90"
          style={{ backgroundColor: "#4CA1F0" }}
        >
          Go Home
        </button>
      </div>
    </div>
  );
};
export default NotFoundPage;
