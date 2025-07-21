import { useMutation } from "@tanstack/react-query";
import { addToast } from "@heroui/toast";

import { createLecture } from "../services/course";

export function useCreateLecture() {
  return useMutation({
    mutationFn: createLecture,
    onError: () => {
      addToast({
        title: "Lecture creation",
        description: "Failed to create lecture",
        color: "danger",
      });
    },
  });
}
