import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { addToast } from "@heroui/toast";

import { logout } from "../services/auth";

import { useAuthStore } from "@/store/auth-store";

export function useLogout() {
  const navigate = useNavigate();
  const { signout } = useAuthStore();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      navigate({ to: "/auth/sign-in" });
      signout();
      addToast({
        title: "Logout",
        description: "User has been successfully logged out",
        color: "success",
      });
    },
  });
}
