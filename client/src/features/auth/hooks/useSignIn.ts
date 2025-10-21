import { addToast } from "@heroui/toast";
import { useMutation } from "@tanstack/react-query";
import { useLocation, useNavigate } from "@tanstack/react-router";

import { useAuthStore } from "@/store/auth-store";
import { auth } from "@/lib/better-auth/auth";
import { Role } from "@/shared/enums/Role";

import { signIn } from "../services/auth";

export function useSignIn() {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const { search } = useLocation();

  const redirectTo = (search as Record<string, any>)?.redirect;

  return useMutation({
    mutationFn: signIn,
    onSuccess: async (data) => {
      setUser(data.user as unknown as User);

      navigate({
        to:
          (redirectTo ??
          (data.user as unknown as User)?.roles[0] === Role.ADMIN)
            ? "/admin"
            : "/home",
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
