import React, { useState } from "react";
import AuthLayout from "../../layouts/AuthLayout";
import Button from "../../components/ui/Button";
import AuthIntro from "../../components/auth/AuthIntro";
import Input from "../../components/ui/Input";
import PasswordStrengthMeter from "../../components/auth/PasswordStrengthMeter";
import useSignUp from "../../hooks/auth/useSignup";
import ErrorAlert from "../../components/common/ErrorAlert";

const SignupPage = () => {
  const [credentials, setCredentials] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const {
    isPending,
    signupMutation,
    fieldErrors,
    generalError,
    clearErrors,
    retryAfter,
    setRetryAfter,
  } = useSignUp();

  // const { cooldown, isActive, formatTime } = useCooldown(retryAfter);

  const handleSignup = (e) => {
    e.preventDefault();

    // if (isActive) return;

    clearErrors();
    setRetryAfter(null);
    signupMutation(credentials);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };
  return (
    <AuthLayout>
      <AuthIntro
        heading="Welcome To Edupeerhub"
        subText="Already have an account?"
        linkText="Log In"
        linkTo="/login"
      />
      <ErrorAlert message={generalError} />

      <form onSubmit={handleSignup} className="space-y-2">
        <Input
          label="First Name"
          name="firstName"
          value={credentials.firstName}
          onChange={handleChange}
          required
        />
        {fieldErrors.firstName && (
          <span className="text-error text-xs mt-1">
            {fieldErrors.firstName}
          </span>
        )}
        <Input
          label="Last Name"
          name="lastName"
          value={credentials.lastName}
          onChange={handleChange}
          required
        />
        {fieldErrors.lastName && (
          <span className="text-error text-xs mt-1">
            {fieldErrors.lastName}
          </span>
        )}
        <Input
          label="Email"
          name="email"
          type="email"
          value={credentials.email}
          onChange={handleChange}
          required
        />
        {fieldErrors.email && (
          <span className="text-error text-xs mt-1">{fieldErrors.email}</span>
        )}
        <Input
          label="Password"
          type="password"
          placeholder="********"
          name="password"
          value={credentials.password}
          onChange={handleChange}
          required
        />
        {fieldErrors.password && (
          <span className="text-error text-xs mt-1">
            {fieldErrors.password}
          </span>
        )}
        <PasswordStrengthMeter password={credentials.password} />

        <Button type="submit">
          {isPending ? (
            <>
              <span className="loading loading-spinner loading-xs"></span>
              Loading...
            </>
          ) : (
            // : isActive ? (
            // `Wait ${formatTime} to retry`
            // )
            "Create Account"
          )}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default SignupPage;
