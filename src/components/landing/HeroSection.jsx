import Button from "./LandingButton";
import { ASSETS } from "../../config/assets";
import useAuthStatus from "../../hooks/auth/useAuthStatus";

const HeroSection = () => {
  const { isAuthenticated, roleLink } = useAuthStatus();

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center pt-16 md:pt-20"
      style={{
        backgroundImage: `url(${ASSETS.hero.backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-gray-900/70"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
          <span className="text-blue-500">Peer Tutoring</span> that Bridges
          <br />
          the Education Gap.
        </h1>

        <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-8 md:mb-12 max-w-3xl mx-auto">
          Join a movement of students and volunteers working together to make
          learning fun, and fair.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {isAuthenticated ? (
            <Button to={roleLink} variant="primary" size="md">
              Go to Dashboard
            </Button>
          ) : (
            <>
              <Button to="/signup" variant="primary" size="lg">
                Become a Tutor
              </Button>
              <Button to="/signup" variant="outline" size="lg">
                Join as a Student
              </Button>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
