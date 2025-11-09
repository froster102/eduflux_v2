import { z } from 'zod/v4';

import { contentLimits } from '@/config/content-limits';

export const updateProfileSchema = z
  .object({
    firstName: z
      .string({ error: 'Required' })
      .trim()
      .regex(/^[A-Za-z0-9]+( [A-Za-z0-9]+)*$/, {
        message: 'Please enter a valid name',
      }),
    lastName: z
      .string({ error: 'Required' })
      .trim()
      .regex(/^[A-Za-z0-9]+( [A-Za-z0-9]+)*$/, {
        message: 'Avoid special characters, use spaces',
      }),
    bio: z.string().refine(
      (val) => {
        if (typeof val !== 'string' || val.length === 0) {
          return true;
        }

        const words = val.split(' ');

        return (
          words.length >= contentLimits.BIO.MIN_LENGTH &&
          words.length <= contentLimits.BIO.MAX_LENGTH
        );
      },
      {
        error: `Bio words should be between ${contentLimits.BIO.MIN_LENGTH} and ${contentLimits.BIO.MAX_LENGTH} words`,
      },
    ),
    image: z.string(),
  })
  .partial();
