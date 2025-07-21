import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToast } from "@heroui/toast";

import { updateProfile } from "../services/account";

import { useAuthStore } from "@/store/auth-store";

export function useUpdateProfile() {
  const { user, updateUser } = useAuthStore();
  const queryClient = useQueryClient();
  const key = `user-${user!.id}-profile`;

  return useMutation({
    mutationFn: updateProfile,

    onMutate: async (newProfile) => {
      await queryClient.cancelQueries({
        queryKey: [key],
      });

      const prev = queryClient.getQueryData([key]);

      queryClient.setQueryData([key], (old: UserProfile) => ({
        ...old,
        ...newProfile,
      }));

      return { prev };
    },

    onSuccess: (_, requestData) => {
      updateUser({
        ...requestData,
        name: requestData.firstName + " " + requestData.lastName,
      });
      addToast({
        title: "Profile updation",
        description: "Your profile has been update successfully",
        color: "success",
      });
    },

    onError: (_, _var, context) => {
      queryClient.setQueryData([key], context!.prev);
      addToast({
        title: "Profile updation",
        description: "Failed to update your profile",
        color: "danger",
      });
    },
  });
}
