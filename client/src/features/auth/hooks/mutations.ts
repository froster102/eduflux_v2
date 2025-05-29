import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Location, NavigateFunction } from "react-router";
import { AxiosError } from "axios";
import { addToast } from "@heroui/toast";

import {
  forgotPassword,
  googleSignIn,
  resetPassword,
  signIn,
  signUp,
  terminateSession,
  updateUserPassword,
} from "../services/auth-services";

import { useAuthStore } from "@/store/auth-store";
// import { routes } from "@/config/site";

export function useSignInMutation(
  navigate: NavigateFunction,
  location: Location,
) {
  return useMutation({
    mutationFn: signIn,
    onSuccess: (res) => {
      const { accessToken, role, userId } = res.data as {
        accessToken: string;
        role: Role;
        userId: string;
      };
      const setAuth = useAuthStore.getState()?.setAuth;
      // const from = location.state?.from?.pathname || routes[role];
      const allowedRoles = location.state?.role;

      setAuth({
        accessToken,
        role,
        userId,
      });

      let redirectRoute = "/";

      if (allowedRoles) {
        if (allowedRoles.includes(role)) {
          // redirectRoute = from;
        } else {
          // redirectRoute = routes[role];
        }
      }
      navigate(redirectRoute, { replace: true });
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        "Oops something wrong with your request";

      if (error.response?.data?.statusCode === 403) {
        navigate("/auth/account-blocked");
      }
      addToast({
        title: "User authentication failed",
        description: errorMessage,
        color: "danger",
      });
    },
  });
}

export function useSignUpMutaion(navigate: NavigateFunction) {
  return useMutation({
    mutationFn: signUp,
    onSuccess: (res) => {
      addToast({
        title: "Account verification",
        description: res.data.message,
        color: "success",
      });
      navigate("/auth/signin");
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      const errorMessage =
        error.response?.data?.message ||
        "Oops something wrong with your request";

      addToast({
        title: "Failed to sign up user",
        description: errorMessage,
        color: "danger",
      });
    },
  });
}

export function useForgotPasswordMutation(navigate: NavigateFunction) {
  return useMutation({
    mutationFn: forgotPassword,
    onSuccess: (res) => {
      addToast({
        title: "Forgot password",
        description: res.data.message,
        color: "success",
      });
      navigate("/auth/signin");
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      const errorMessage =
        error.response?.data?.message ||
        "Oops something wrong with your request";

      addToast({
        title: "Failed to proceed",
        description: errorMessage,
        color: "danger",
      });
    },
  });
}

export function useResetPasswordMutaion(navigate: NavigateFunction) {
  return useMutation({
    mutationFn: resetPassword,
    onSuccess: (res) => {
      addToast({
        title: "Password reset success",
        description: res.data.message,
        color: "success",
      });
      navigate("/auth/signin");
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      const errorMessage =
        error.response?.data?.message ||
        "Oops something wrong with your request";

      addToast({
        title: "Password reset failed",
        description: errorMessage,
        color: "danger",
      });
    },
  });
}

export function useGoogleLoginMutation(
  navigate: NavigateFunction,
  location: Location,
) {
  return useMutation({
    mutationFn: googleSignIn,
    onSuccess: (res) => {
      const { accessToken, role, userId } = res.data as {
        accessToken: string;
        role: Role;
        userId: string;
      };
      const setAuth = useAuthStore.getState()?.setAuth;
      // const from = location.state?.from?.pathname || routes[role];
      const allowedRoles = location.state?.role;

      setAuth({
        accessToken,
        role,
        userId,
      });

      let redirectRoute = "/";

      if (allowedRoles) {
        if (allowedRoles.includes(role)) {
          // redirectRoute = from;
        } else {
          // redirectRoute = routes[role];
        }
      }
      navigate(redirectRoute, { replace: true });
    },
    onError: (error: any) => {
      if (error.response?.data?.statusCode === 403) {
        navigate("/auth/account-blocked");
      }

      addToast({
        title: "User logout failed",
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
