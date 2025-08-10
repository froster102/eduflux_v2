import { createAuthClient } from "better-auth/react";
import {
  emailOTPClient,
  inferAdditionalFields,
  jwtClient,
} from "better-auth/client/plugins";

export const auth = createAuthClient({
  baseURL: "http://localhost:8000",
  plugins: [
    inferAdditionalFields({
      user: {
        roles: {
          type: "string[]",
          input: false,
        },
      },
    }),
    emailOTPClient(),
    jwtClient(),
  ],
});
