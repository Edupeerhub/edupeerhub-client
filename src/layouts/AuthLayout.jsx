import ImageSlider from "../components/auth/ImageSlider";

const AuthLayout = ({ children }) => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full overflow-hidden">
      {/* Left: Image slide */}
      <div className="relative hidden md:flex w-1/2 min-h-screen overflow-hidden">
        <div className="absolute inset-0">
          <ImageSlider />
        </div>
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 text-center px-6 max-w-md">
          <h1 className="text-3xl font-bold text-white">
            Connect with friends
          </h1>
          <p className="mt-4 text-lg text-white/90">
            Get the tools and guidance you need to pass with confidence.
          </p>
        </div>
      </div>

      {/* Right: Dynamic Page Content */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;
