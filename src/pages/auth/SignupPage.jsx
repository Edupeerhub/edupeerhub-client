import React from "react";
import AuthLayout from "../../layouts/AuthLayout";
import Button from "../../components/ui/Button";
import AuthIntro from "../../components/auth/AuthIntro";
import Input from "../../components/ui/Input";

const SignupPage = () => {
  return (
    <AuthLayout>
      <AuthIntro
        heading="Welcome To Edupeerhub"
        subText="Already have an account?"
        linkText="Log In"
        linkTo="/login"
      />
      <form className="space-y-4">
        <Input
          label="First Name"
          name="firstName"
          // value={firstName}
          // onChange={handleChange}
        />
        <Input
          label="Last Name"
          name="lastName"
          // value={lastName}
          // onChange={handleChange}
        />
        <Input
          label="Email"
          name="email"
          // value={email}
          // onChange={handleChange}
        />
        <Input
          label="Password"
          type="password"
          name="password"
          // value={password}
          // onChange={handleChange}
        />
        <Button
        // onClick={handleSubmit}
        >
          Create Account
        </Button>
      </form>
    </AuthLayout>
  );
};

export default SignupPage;
