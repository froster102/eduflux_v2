import { useMutation } from "@tanstack/react-query";

import { updateSessionSettings } from "../services/session";

export function useUpdateSessionSettings() {
  return useMutation({
    mutationFn: updateSessionSettings,
  });
}
