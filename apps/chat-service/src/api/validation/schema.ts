import { paginationSchema } from "@api/validation/paginationSchema";
import { Role } from "@core/common/enum/Role";
import { z } from "zod/v4";

export const getChatsSchema = paginationSchema.extend({
  role: z.enum([Role.INSTRUCTOR, Role.LEARNER]).default(Role.LEARNER),
});

export const createChatSchema = z.object({
  instructorId: z.string({ error: "Instructor id is required" }),
});

export const getChatExistsSchema = z.object({
  filter: z.object({
    instructorId: z.string(),
  }),
});

export const getMessagesSchema = z.object({
  page: z.object({
    cursor: z.iso.datetime({ offset: true }).optional(),
    size: z.coerce.number().int().positive().default(20),
  }),
});
