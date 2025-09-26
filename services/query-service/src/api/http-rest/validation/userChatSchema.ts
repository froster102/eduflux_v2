import { paginationSchema } from "@api/http-rest/validation/paginationSchema";
import { Role } from "@core/common/enums/Role";
import { z } from "zod/v4";

const getUserChatsFilter = z.object({
  role: z
    .enum([Role.INSTRUCTOR, Role.LEARNER])
    .optional()
    .default(Role.LEARNER),
});

export const getUserChatsSchema = z.object({
  ...getUserChatsFilter.shape,
  ...paginationSchema.shape,
});
