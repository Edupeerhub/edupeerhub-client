import ImageSlider from "../components/auth/ImageSlider";

const AuthLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      {/* Left: Image slide */}
      <div className="w-1/2 bg-[#CDE1FF] hidden md:flex items-center justify-center">
        <ImageSlider />
      </div>

      {/* Right: Dynamic Page Content */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;
