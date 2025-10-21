import { useMutation, useQueryClient } from "@tanstack/react-query";

import { banUser } from "@/features/admin/service/admin";

export function useBanUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: banUser,
    onMutate: async (userId: string) => {
      await queryClient.cancelQueries({ queryKey: ["users"] });

      const previousUsers = queryClient.getQueryData<ListUsersReponse>([
        "users",
      ]);

      if (previousUsers) {
        queryClient.setQueryData<ListUsersReponse>(["users"], (old) => {
          if (!old) return old;

          return {
            ...old,
            users: old.users.map((user) =>
              user.id === userId ? { ...user, banned: true } : user,
            ),
          };
        });
      }

      return { previousUsers };
    },
    onError: (_err, _userId, context) => {
      if (context?.previousUsers) {
        queryClient.setQueryData(["users"], context.previousUsers);
      }
    },
  });
}
