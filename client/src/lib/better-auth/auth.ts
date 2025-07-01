import { createAuthClient } from "better-auth/react";
import {
  emailOTPClient,
  inferAdditionalFields,
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
  ],
});

export const { useSession } = auth;
