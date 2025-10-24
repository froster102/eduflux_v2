import { useMutation } from "@tanstack/react-query";

import { deleteLecture } from "../services/course";

export function useDeleteLecture() {
  return useMutation({
    mutationFn: deleteLecture,
  });
}
