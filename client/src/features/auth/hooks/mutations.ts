import { useMutation } from "@tanstack/react-query";
import { addToast } from "@heroui/toast";
import { useNavigate } from "@tanstack/react-router";

import {
  forgotPassword,
  logout,
  resendOtp,
  resetPassword,
  signIn,
  signUp,
  verifyOtp,
} from "../services/auth";

import { useAuthStore } from "@/store/auth-store";
import { useVerificationStore } from "@/store/verification-store";
import { auth } from "@/lib/better-auth/auth";

export function useSignIn() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: signIn,
    onSuccess: async (data) => {
      const setUser = useAuthStore.getState().setUser;

      setUser(data.user as User);

      navigate({
        to: "/learner",
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
    onError: (error: BetterAuthError) => {
      addToast({
        title: "Sign up",
        description: error.message,
        color: "danger",
      });
    },
  });
}

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
    onError: (_error: BetterAuthError) => {
      addToast({
        title: "Forgot Password",
        description: "Something went wrong",
        color: "danger",
      });
    },
  });
}

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
    onError: (error: BetterAuthError) => {
      addToast({
        title: "Reset Password",
        description: error.message,
        color: "danger",
      });
    },
  });
}

export function useResendOtp(onSuccessCallback?: () => void) {
  return useMutation({
    mutationFn: resendOtp,
    onSuccess: () => {
      addToast({
        title: "OTP Sent",
        description:
          "If an account with this email exists, a new OTP has been sent to your email.",
        color: "success",
      });
      if (onSuccessCallback) {
        onSuccessCallback();
      }
    },
    onError: (error: BetterAuthError) => {
      addToast({
        title: "Resend OTP",
        description: error.message,
        color: "danger",
      });
    },
  });
}

export function useLogout() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      navigate({ to: "/auth/sign-in" });
      useAuthStore.getState().signout();
      addToast({
        title: "Logout",
        description: "User has been successfully logged out",
        color: "success",
      });
    },
    onError: () => {
      addToast({
        title: "Logout",
        description: "Failed to logout user",
        color: "danger",
      });
    },
  });
}
