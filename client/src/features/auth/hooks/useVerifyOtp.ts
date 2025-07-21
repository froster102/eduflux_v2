import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { addToast } from "@heroui/toast";

import { verifyOtp } from "../services/auth";

export function useVerifyOtp() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: verifyOtp,
    onSuccess: () => {
      addToast({
        title: "OTP verfication successfull",
        description:
          "Your OTP have been verified successfully,Please sign in to continue",
        color: "success",
      });
      navigate({ to: "/auth/sign-in" });
    },
    onError: (error: BetterAuthError) => {
      addToast({
        title: "Email verification",
        description: error.message,
        color: "danger",
      });
    },
  });
}
