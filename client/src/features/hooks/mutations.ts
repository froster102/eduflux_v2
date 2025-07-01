import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToast } from "@heroui/toast";

import {
  cancelStudentSession,
  markStudentSessionAsComplete,
} from "../learner/services/learner";

export function useCancelSessionMutaion(queryParams: QueryParams) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelStudentSession,

    onMutate: async (sessionId: string) => {
      await queryClient.cancelQueries({ queryKey: ["studentSessions"] });
      const previousSessions = queryClient.getQueryData([
        "studentSessions",
        queryParams,
      ]);

      queryClient.setQueryData(
        ["studentSessions", queryParams],
        (old: { totalCount: number; sessions: StudentSession[] }) => {
          if (!old) return old;
          const newSessions = old.sessions.map((session) =>
            session.id === sessionId
              ? { ...session, status: "cancelled" }
              : session,
          );

          return { ...old, sessions: newSessions };
        },
      );

      return { previousSessions };
    },

    onSuccess: () => {
      addToast({
        title: "Session cancellation",
        description: "Student session has been cancelled successfully",
        color: "success",
      });
      //   queryClient.invalidateQueries({ queryKey: ["studentSessions"] });
    },

    onError: (error: any, _sessionId, context) => {
      if (context?.previousSessions) {
        queryClient.setQueryData(
          ["studentSessions", queryParams],
          context.previousSessions,
        );
      }
      const errorMessage =
        error.response.data.message || "Failed to cancel student session";

      addToast({
        title: "Session cancellation failed",
        description: errorMessage,
        color: "danger",
      });
    },
  });
}

export function useMarkStudentSessionAsCompleteMutation(
  queryParams: QueryParams,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markStudentSessionAsComplete,

    onMutate: async (sessionId: string) => {
      await queryClient.cancelQueries({ queryKey: ["studentSessions"] });
      const previousSessions = queryClient.getQueryData([
        "studentSessions",
        queryParams,
      ]);

      queryClient.setQueryData(
        ["studentSessions", queryParams],
        (old: { totalCount: number; sessions: StudentSession[] }) => {
          if (!old) return old;
          const newSessions = old.sessions.map((session) =>
            session.id === sessionId
              ? { ...session, status: "completed" }
              : session,
          );

          return { ...old, sessions: newSessions };
        },
      );

      return { previousSessions };
    },

    onSuccess: () => {
      addToast({
        title: "Session Mark as completion",
        description:
          "Student session has been marked as completed successfully",
        color: "success",
      });
      //   queryClient.invalidateQueries({ queryKey: ["studentSessions"] });
    },

    onError: (error: any, _sessionId, context) => {
      if (context?.previousSessions) {
        queryClient.setQueryData(
          ["studentSessions", queryParams],
          context.previousSessions,
        );
      }
      const errorMessage =
        error.response.data.message ||
        "Failed to mark student session as completed";

      addToast({
        title: "Session Mark as completion",
        description: errorMessage,
        color: "danger",
      });
    },
  });
}
