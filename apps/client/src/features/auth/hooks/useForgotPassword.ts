import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { addToast } from "@heroui/toast";

import { forgotPassword } from "../services/auth";

export function useForgotPassword() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => {
      addToast({
        title: "Forgot Password",
        description:
          "If an account with that email exists, you’ll receive a one-time password (OTP) shortly.",
        color: "success",
      });

      navigate({ to: "/auth/reset-password" });
    },
  });
}
