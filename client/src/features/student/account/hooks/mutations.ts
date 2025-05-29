import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToast } from "@heroui/toast";

import { updateStudentProfile } from "../service/account-services";

export function useUpdateStudentProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateStudentProfile,
    onSuccess: () => {
      addToast({
        title: "Profile updated",
        description: "Profile updated successfully",
        color: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}
