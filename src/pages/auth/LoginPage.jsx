import AuthIntro from "../../components/auth/AuthIntro";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import AuthLayout from "../../layouts/AuthLayout";

const LoginPage = () => {
  return (
    <AuthLayout>
      <AuthIntro
        heading="Welcome Back"
        subText="Don't have an account?"
        linkText="Sign up"
        linkTo="/signup"
      />
      <form className="space-y-4">
        <Input
          label="Email"
          name="email"
          placeholder={"Enter your email"}
          type="email"
          // value={email}
          // onChange={handleChange}
        />
        <Input
          label="Password"
          name="password"
          placeholder={"Enter your password"}
          type="password"
          // value={password}
          // onChange={handleChange}
        />

        <Button
        // onClick={handleSubmit}
        >
          Log in
        </Button>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
