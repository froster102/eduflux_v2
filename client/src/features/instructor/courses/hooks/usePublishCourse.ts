import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { addToast } from "@heroui/toast";

import { publishCourse } from "../services/course";

export function usePublishCourse(options?: {
  onError: (errorMessage: string) => void;
}) {
  return useMutation({
    mutationFn: publishCourse,

    onError: (error: AxiosError<ApiErrorResponse>) => {
      if (options?.onError && error.response?.data.code === "INVALID_INPUT") {
        options.onError(error.response?.data.message);
      } else {
        addToast({
          title: "Course publishment",
          description: "Failed to publish course.",
          color: "danger",
        });
      }
    },

    onSuccess: () => {
      addToast({
        title: "Course published",
        description: "Your course has been successfully published",
        color: "success",
      });
    },
  });
}
