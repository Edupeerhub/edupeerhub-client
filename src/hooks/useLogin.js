import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "../lib/api/auth";
import { useState } from "react";
import toast from "react-hot-toast";

const useLogin = () => {
  const queryClient = useQueryClient();

  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [retryAfter, setRetryAfter] = useState(null);

  const { mutate, isPending, error } = useMutation({
    mutationFn: login,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      toast.success("Login successful! Welcome back!");
      setRetryAfter(null);
    },
    onError: (error) => {
      const responseData = error.response?.data;

      if (error.response?.status === 429 && responseData?.retryAfter) {
        setRetryAfter(responseData.retryAfter);
        setGeneralError(
          responseData?.message ||
            "Too many login attempts. Please wait before trying again."
        );
        toast.error(error);
        return;
      }

      if (Array.isArray(responseData?.error)) {
        // Validation (field) errors
        const errors = {};
        responseData.error.forEach((err) => {
          errors[err.field] = err.issue;
        });
        setFieldErrors(errors);
        toast.error(error);
      } else {
        // General error
        const msg = responseData?.message || "An error occurred.";
        setGeneralError(msg);
        toast.error(error);
      }
    },
  });

  const clearErrors = () => {
    setFieldErrors({});
    setGeneralError("");
  };

  return {
    error,
    isPending,
    loginMutation: mutate,
    fieldErrors,
    generalError,
    clearErrors,
    retryAfter,
    setRetryAfter,
  };
};

export default useLogin;
