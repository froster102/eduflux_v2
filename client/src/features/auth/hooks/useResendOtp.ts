import { useMutation } from "@tanstack/react-query";
import { addToast } from "@heroui/toast";

import { resendOtp } from "../services/auth";

export function useResendOtp(onSuccessCallback?: () => void) {
  return useMutation({
    mutationFn: resendOtp,
    onSuccess: () => {
      addToast({
        title: "OTP Sent",
        description:
          "If an account with this email exists, a new OTP has been sent to your email.",
        color: "success",
      });
      if (onSuccessCallback) {
        onSuccessCallback();
      }
    },
  });
}
