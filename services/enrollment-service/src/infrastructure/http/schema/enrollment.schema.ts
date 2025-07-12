import z from 'zod/v4';

export const createEnrollmentSchema = z.object({
  courseId: z.string({ error: 'Invalid course ID' }),
});
