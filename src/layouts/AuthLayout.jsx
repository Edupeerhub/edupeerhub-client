import authImage from "../assets/auth-illustration.svg"; // example image
import Input from "../components/ui/Input";

const AuthLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      {/* Left: Fixed Image */}
      <div className="w-1/2 bg-[#CDE1FF] hidden md:flex items-center justify-center">
        <img src={authImage} alt="Auth Visual" className="max-w-full h-auto" />
      </div>

      {/* Right: Dynamic Page Content */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;
