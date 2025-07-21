import { useMutation } from "@tanstack/react-query";

import { enrollForCourse } from "../services/course";

export function useEnrollForCourse() {
  return useMutation({
    mutationFn: enrollForCourse,
  });
}
