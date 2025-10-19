import { contentLimits } from '@shared/config/content-limits.config';
import z from 'zod/v4';

export const rejectCourseSchema = z.object({
  feedback: z.string().min(contentLimits.COURSE_FEEDBACK.MIN_LENGTH, {
    error: `Feedback must be at least ${contentLimits.COURSE_FEEDBACK.MIN_LENGTH} characters`,
  }),
});
