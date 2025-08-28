import { CONTENT_LIMITS } from '@shared/config/content-limits';
import z from 'zod/v4';

export const updateUserSchema = z.object({
  firstName: z
    .string()
    .min(CONTENT_LIMITS.FIRST_NAME.MIN_LENGTH)
    .max(CONTENT_LIMITS.FIRST_NAME.MAX_LENGTH),
  lastName: z
    .string()
    .min(CONTENT_LIMITS.LAST_NAME.MIN_LENGTH)
    .max(CONTENT_LIMITS.LAST_NAME.MAX_LENGTH),
  bio: z
    .string()
    .refine(
      (val) => {
        if (typeof val !== 'string' || val.length === 0) {
          return true;
        }

        const words = val.split(' ');
        return (
          words.length >= CONTENT_LIMITS.BIO.MIN_LENGTH &&
          words.length <= CONTENT_LIMITS.BIO.MAX_LENGTH
        );
      },
      {
        error: `Bio words should be between ${CONTENT_LIMITS.BIO.MIN_LENGTH} and ${CONTENT_LIMITS.BIO.MAX_LENGTH} words`,
      },
    )
    .optional(),
  image: z.string().optional(),
  socialLinks: z
    .array(
      z.object({
        platform: z.enum([
          'x',
          'facebook',
          'instagram',
          'linkedin',
          'youtube',
          'website',
        ]),
        url: z.url(),
      }),
    )
    .optional(),
});

export const updateUserSessionPricingSchema = z.object({ price: z.number() });
