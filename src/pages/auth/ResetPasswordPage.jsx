import { useState } from "react";
import logo from "../../assets/images/edupeerhub-logo1.svg";

import { useParams } from "react-router";
import { Lock } from "lucide-react";
import toast from "react-hot-toast";
import useResetPassword from "../../hooks/auth/useResetPassword";
import ErrorAlert from "../../components/common/ErrorAlert";
import AuthLayout from "../../layouts/AuthLayout";
import Button from "../../components/ui/Button";
import { useCooldown } from "../../hooks/auth/useCooldown";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { token } = useParams();

  const {
    resetPasswordMutation,
    fieldErrors,
    generalError,
    clearErrors,
    isPending,
    retryAfter,
    setRetryAfter,
  } = useResetPassword();

  const { label, isActive, formattedTime } = useCooldown(retryAfter);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isActive) return;

    clearErrors();
    setRetryAfter(null);
    if (password !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    resetPasswordMutation({ token, password });
  };

  return (
    <AuthLayout>
      <div className=" flex flex-col items-center justify-center gap-2 mb-5 ">
        <img src={logo} alt="Edupeerhub" />
        <h2 className="text-xl font-semibold  text-start">Reset Password</h2>
      </div>
      {generalError && <ErrorAlert error={generalError} />}
      <div className="w-full">
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <div className="flex flex-col gap-4">
                <div className="form-control w-full space-y-2">
                  <input
                    icon={Lock}
                    type="password"
                    className="input input-bordered w-full"
                    placeholder="New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  {fieldErrors.password && (
                    <span className="text-red-500 text-sm">
                      {fieldErrors.password}
                    </span>
                  )}
                </div>
                <div className="form-control w-full space-y-2">
                  <input
                    icon={Lock}
                    type="password"
                    className="input input-bordered w-full"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isPending || isActive}
                  loading={isPending}
                >
                  {isPending
                    ? "Resetting..."
                    : isActive
                    ? `Wait ${formattedTime} ${label} to retry`
                    : "Set New Password"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};

export default ResetPasswordPage;
