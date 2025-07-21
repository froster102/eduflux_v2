import { useMutation } from "@tanstack/react-query";

import { updateCurriculumItems } from "../services/course";

export function useUpdateCurriculumItems() {
  return useMutation({
    mutationFn: updateCurriculumItems,
  });
}
