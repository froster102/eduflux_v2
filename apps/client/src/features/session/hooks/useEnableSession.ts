import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { addToast } from "@heroui/toast";

import { useAuthStore } from "@/store/auth-store";
import { DEFAULT_ERROR_MESSAGE } from "@/config/error-messages";

import { enableSessions } from "../services/session";

export function useEnableSessions() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const queryKey = [`user-${user?.id}-session-settings`];

  return useMutation({
    mutationFn: enableSessions,

    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey });

      const previousSettings = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(
        queryKey,
        (
          old: JsonApiResponse<{
            settings: SessionSettings;
          }>,
        ): JsonApiResponse<{
          settings: SessionSettings;
        }> => ({
          ...old,
          data: {
            ...old.data,
            settings: {
              ...old.data.settings,
              ...variables,
            },
          },
        }),
      );

      return { previousSettings };
    },

    onError: (error: AxiosError<JsonApiErrorResponse> | Error, _, context) => {
      queryClient.setQueriesData({ queryKey }, context?.previousSettings);
      if (error instanceof AxiosError) {
        addToast({
          description: error.response?.data.message || DEFAULT_ERROR_MESSAGE,
          color: "danger",
        });
      } else if (error instanceof Error) {
        addToast({
          description: error.message || DEFAULT_ERROR_MESSAGE,
          color: "danger",
        });
      }
    },
  });
}
