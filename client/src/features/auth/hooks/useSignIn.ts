import { addToast } from "@heroui/toast";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import { useAuthStore } from "@/store/auth-store";
import { auth } from "@/lib/better-auth/auth";

import { signIn } from "../services/auth";

export function useSignIn() {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: signIn,
    onSuccess: async (data) => {
      setUser(data.user as unknown as User);

      navigate({
        to: "/home",
      });
    },

    onError: async (error: BetterAuthError, request) => {
      switch (error.code) {
        case "EMAIL_NOT_VERIFIED": {
          await auth.emailOtp.sendVerificationOtp({
            email: request.email,
            type: "email-verification",
          });
          addToast({
            title: "Sign In",
            description:
              "Please verify your email to sign in, An OTP have been sent to your registered email",
            color: "warning",
          });
          navigate({
            to: "/auth/sign-in",
          });
          break;
        }
        default: {
          addToast({
            title: "Sign in",
            description: error.message,
            color: "danger",
          });
        }
      }
    },
  });
}
