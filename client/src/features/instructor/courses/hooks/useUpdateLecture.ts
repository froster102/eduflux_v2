import { useMutation } from "@tanstack/react-query";
import { addToast } from "@heroui/toast";

import { updateLecture } from "../services/course";

export function useUpdateLecture() {
  return useMutation({
    mutationFn: updateLecture,
    onError: () => {
      addToast({
        title: "Lecture updation",
        description: "Failed to update lecture",
      });
    },
  });
}
