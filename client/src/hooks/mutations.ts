import { useMutation } from "@tanstack/react-query";
import { NavigateFunction } from "react-router";
import { addToast } from "@heroui/toast";

import { logoutUser } from "@/services/logout";
import { useAuthStore } from "@/store/auth-store";

export function useLogoutUserMutaion(navigate: NavigateFunction) {
  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      useAuthStore.getState().signout();
      addToast({
        title: "Logout",
        description: "User has been succcessfully logged out",
      });
      navigate("/auth/signin");
    },
  });
}
