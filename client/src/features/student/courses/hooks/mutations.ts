import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToast } from "@heroui/toast";

import { enrollForCourse } from "../services/course-services";

export function useEnrollForCourseMutaion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: enrollForCourse,

    onSuccess: () => {
      addToast({
        title: "Course Enrollment",
        description:
          "A request for enrollment have been successfully sent,Please wait till your request has been approved",
        color: "success",
      });
    },

    onError: (error: any, _courseId) => {
      const errorMessage =
        error.response.data.message || "Oops something went wrong";

      addToast({
        title: "Course Enrollment",
        description: errorMessage,
        color: "danger",
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}
