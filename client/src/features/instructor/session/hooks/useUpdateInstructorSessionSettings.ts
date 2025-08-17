import { useMutation } from "@tanstack/react-query";

import { updateInstructorSessionSettings } from "../services/session";

export function useUpdateInstructorSessionSettings() {
  return useMutation({
    mutationFn: updateInstructorSessionSettings,
  });
}
