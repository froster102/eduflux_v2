import { useMutation } from "@tanstack/react-query";
import { addToast } from "@heroui/toast";

import { updateUserPassword } from "../services/account";

export function useUpdatePassword() {
  return useMutation({
    mutationFn: updateUserPassword,
    onSuccess: () => {
      addToast({
        title: "Update Password",
        description: "Your password has been updated sucessfully",
        color: "success",
      });
    },
  });
}
