import { useMutation } from "@tanstack/react-query";
import { addToast } from "@heroui/toast";
import { AxiosError } from "axios";

import { deleteChapter } from "../services/course";

export function useDeleteChapter() {
  return useMutation({
    mutationFn: deleteChapter,
    onError: (error: AxiosError<ApiErrorResponse>) => {
      addToast({
        title: "Chapter deletion",
        description: error.response?.data.message || "Failed to delete chapter",
        color: "danger",
      });
    },
  });
}
