import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router";
import { addToast } from "@heroui/toast";

import {
  forgotPassword,
  logout,
  resendOtp,
  resetPassword,
  signIn,
  signUp,
  terminateSession,
  updateUserPassword,
  verifyOtp,
} from "../services/auth-services";

import { authClient } from "@/lib/auth-client";
import { useAuthStore } from "@/store/auth-store";
import { roleBasedRoutes } from "@/config/site";

export function useSignIn() {
  const navigate = useNavigate();
  const location = useLocation();

  return useMutation({
    mutationFn: signIn,
    onSuccess: async (data) => {
      await authClient.getSession({
        fetchOptions: {
          onSuccess: (ctx) => {
            const jwt = ctx.response.headers.get("set-auth-jwt");
            const setAuthData = useAuthStore.getState().setAuthData;

            setAuthData(
              ctx.data.user as User,
              ctx.data.session as Session,
              jwt!,
            );
          },
        },
      });

      const from =
        location.state?.from?.pathname ||
        roleBasedRoutes[(data.user as User).roles[0]];

      navigate(from, { replace: true });
    },

    onError: async (error: BetterAuthError, request) => {
      switch (error.code) {
        case "EMAIL_NOT_VERIFIED": {
          await authClient.emailOtp.sendVerificationOtp({
            email: request.email,
            type: "email-verification",
          });
          addToast({
            title: "Sign In",
            description:
              "Please verify your email to sign in, An OTP have been sent to your registered email",
            color: "warning",
          });
          navigate("/auth/verify", {
            state: { verificationEmail: request.email },
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

  return useMutation({
    mutationFn: signUp,
    onSuccess: (data) => {
      if (data) {
        addToast({
          title: "Sign Up",
          description: "A verification code has been sent to your email.",
          color: "success",
        });
        navigate("/auth/verify", {
          replace: true,
          state: {
            verificationEmail: data.user.email,
          },
        });
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
      navigate("/auth/signin", { replace: true });
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
    onSuccess: (_data, email) => {
      addToast({
        title: "Forgot Password",
        description:
          "If an account with that email exists, you’ll receive a one-time password (OTP) shortly.",
        color: "success",
      });

      navigate("/auth/reset-password", { state: { email } });
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
      navigate("/auth/signin", { replace: true });
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
      navigate("/auth/signin");
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

export function useTerminateSessionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: terminateSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      addToast({
        title: "Session terminated",
        description: "Session terminated successfuly",
        color: "success",
      });
    },
  });
}

export function useUpdatePasswordMutation() {
  return useMutation({
    mutationFn: updateUserPassword,
    onSuccess: () => {
      addToast({
        title: "Update Password",
        description: "Your password has been updated sucessfully",
        color: "success",
      });
    },
    onError: (error: any) => {
      addToast({
        title: "Update Password",
        description: error.response.data.message,
        color: "danger",
      });
    },
  });
}
