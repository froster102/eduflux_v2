import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToast } from "@heroui/toast";

import { createStudentSession } from "../services/instructor";

export function useCreateStudentSessionMutation(queryParams: QueryParams) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createStudentSession,

    onSuccess: () => {
      addToast({
        title: "Session creation",
        description: "Session for student has been successfully created",
        color: "success",
      });
    },

    onError: (error: any) => {
      const errorMessage =
        error.response.data.message ||
        "Failed to created session for the student";

      addToast({
        title: "Session creation failed",
        description: errorMessage,
        color: "danger",
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["studentSessions", queryParams],
      });
    },
  });
}
