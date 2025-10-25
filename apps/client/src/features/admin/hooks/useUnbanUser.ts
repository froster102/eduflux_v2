import { useMutation, useQueryClient } from '@tanstack/react-query';

import { unbanUser } from '@/features/admin/service/admin';

export function useUnbanUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: unbanUser,
    onMutate: async (userId: string) => {
      await queryClient.cancelQueries({ queryKey: ['users'] });

      const previousUsers = queryClient.getQueryData<ExtendedUser[]>(['users']);

      if (previousUsers) {
        queryClient.setQueryData<ListUsersReponse>(['users'], (old) => {
          if (!old) return old;

          return {
            ...old,
            users: old.users.map((user) =>
              user.id === userId ? { ...user, banned: false } : user,
            ),
          };
        });
      }

      return { previousUsers };
    },

    onError: (_err, _userId, context) => {
      if (context?.previousUsers) {
        queryClient.setQueryData(['users'], context.previousUsers);
      }
    },
  });
}
