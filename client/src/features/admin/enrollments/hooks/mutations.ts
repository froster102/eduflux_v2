import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToast } from "@heroui/toast";

import { approveEnrollment, rejectEnrollment } from "../services/enrollment-services";

export function useApproveEnrollmentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: approveEnrollment,
    onSuccess: () => {
      addToast({
        title: "Enrollment approval",
        description: "Enrollment has been successfully approved",
        color: "success",
      });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || "Oops something went wrong";

      addToast({
        title: "Enrollment approval",
        description: errorMessage,
        color: "danger",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
    },
  });
}

export function useRejectEnrollmentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rejectEnrollment,
    onSuccess: () => {
      addToast({
        title: "Enrollment Rejection",
        description: "Enrollment has been successfully rejected",
      });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || "Oops something went wrong";

      addToast({
        title: "Enrollment approval",
        description: errorMessage,
        color: "danger",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
    },
  });
}
