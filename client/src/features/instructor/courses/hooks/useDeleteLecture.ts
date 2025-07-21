import { useMutation } from "@tanstack/react-query";
import { addToast } from "@heroui/toast";

import { deleteLecture } from "../services/course";

export function useDeleteLecture() {
  return useMutation({
    mutationFn: deleteLecture,
    onError: () => {
      addToast({
        title: "Lecture deletion",
        description: "Failed to delete lecture",
      });
    },
  });
}
