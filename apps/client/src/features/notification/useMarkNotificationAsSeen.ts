import { useMutation, useQueryClient } from '@tanstack/react-query';

import { markAsSeen } from '@/features/notification/service/notification';

export function useMarkNotificationAsSeen() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAsSeen,

    onMutate: async (notificationId) => {
      await queryClient.cancelQueries({ queryKey: [`notifications`] });

      const previousNotifications = queryClient.getQueryData([`notifications`]);

      queryClient.setQueryData(
        ['notifications'],
        (
          old: JsonApiResponse<AppNotification[]>,
        ): JsonApiResponse<AppNotification[]> => {
          return {
            ...old,
            data: old.data.filter(
              (notification) => notification.id !== notificationId,
            ),
          };
        },
      );

      return { previousNotifications };
    },

    onError: (_, __, context) => {
      queryClient.setQueryData(
        ['notifications'],
        context?.previousNotifications,
      );
    },
  });
}
