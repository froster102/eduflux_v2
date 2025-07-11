import z from 'zod/v4';

export const createEnrollmentSchema = z.object({
  courseId: z.uuidv4({ error: 'Invalid course ID' }),
});
