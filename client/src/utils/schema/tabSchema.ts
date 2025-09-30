import { z } from "zod/v4";

export const tabSchema = z.object({
  tab: z.enum(["profile", "account", "session"]).catch("profile"),
});
