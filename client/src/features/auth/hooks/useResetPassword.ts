import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { addToast } from "@heroui/toast";

import { resetPassword } from "../services/auth";

export function useResetPassword() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: resetPassword,
    onSuccess: (_data) => {
      addToast({
        title: "Reset Password",
        description: "Password reset successful. Please sign in.",
        color: "success",
      });
      navigate({ to: "/auth/sign-in" });
    },
  });
}
