import { addToast } from "@heroui/toast";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import { signUp } from "../services/auth";

import { useVerificationStore } from "@/store/verification-store";

export function useSignUp() {
  const navigate = useNavigate();
  const { setVerificationEmail } = useVerificationStore();

  return useMutation({
    mutationFn: signUp,

    onSuccess: (data) => {
      if (data) {
        addToast({
          title: "Sign Up",
          description: "A verification code has been sent to your email.",
          color: "success",
        });

        setVerificationEmail(data.user.email);

        navigate({ to: "/auth/verify", from: "/auth/sign-up" });
      }
    },
  });
}
