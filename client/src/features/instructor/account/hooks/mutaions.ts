import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToast } from "@heroui/toast";

import { updateTutorProfile } from "../services/account";

export function useUpdateTutorProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTutorProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tutor"] });
      addToast({
        title: "Profile",
        description: "Your profile has been updated successfully",
        color: "success",
      });
    },
  });
}
