import { useMutation } from "@tanstack/react-query";

import { updateInstructorWeeklyAvailability } from "../services/session";

export function useUpdateInstructorAvailability() {
  return useMutation({
    mutationFn: updateInstructorWeeklyAvailability,
  });
}
