import { z } from "zod/v4";

export const createChatSchema = z.object({
  instructorId: z.string({ error: "Instructor id is required" }),
});

export const getChatExistsSchema = z.object({
  instructorId: z.string(),
});
