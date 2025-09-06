import { paginationSchema } from "@api/graphql/validation/paginationSchema";
import { Role } from "@core/common/enum/Role";
import { z } from "zod/v4";

export const getChatsSchema = paginationSchema.extend({
  role: z.enum([Role.INSTRUCTOR, Role.LEARNER]).default(Role.LEARNER),
});
