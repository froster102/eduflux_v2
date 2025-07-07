import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToast } from "@heroui/toast";

import { updateProfile, updateUserPassword } from "../services/account";

import { useAuthStore } from "@/store/auth-store";

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
    onError: (error: any) => {
      addToast({
        title: "Update Password",
        description: error.message,
        color: "danger",
      });
    },
  });
}

export function useUpdateProfile() {
  const { user } = useAuthStore();
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

    onSuccess: () => {
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

// export function useTerminateSessionMutation() {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: terminateSession,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["sessions"] });
//       addToast({
//         title: "Session terminated",
//         description: "Session terminated successfuly",
//         color: "success",
//       });
//     },
//   });
// }
