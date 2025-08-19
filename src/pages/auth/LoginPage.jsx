import { useNavigate } from "react-router-dom";
import AuthIntro from "../../components/auth/AuthIntro";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import AuthLayout from "../../layouts/AuthLayout";

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Here you'd normally check credentials with your backend

    // For now, just go to onboarding
    navigate("/student-onboarding");
  };

  return (
    <AuthLayout>
      <AuthIntro
        heading="Welcome Back"
        subText="Don't have an account?"
        linkText="Sign up"
        linkTo="/signup"
      />
      <form className="space-y-4" onSubmit={handleLogin}>
        <Input
          label="Email"
          name="email"
          placeholder="Enter your email"
          type="email"
        />
        <Input
          label="Password"
          name="password"
          placeholder="Enter your password"
          type="password"
        />

        <Button type="submit">
          Log in
        </Button>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;