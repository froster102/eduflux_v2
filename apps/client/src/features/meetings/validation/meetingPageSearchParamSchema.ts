import z4 from 'zod/v4';

export const meetingPageSearchParamSchema = z4.object({
  returnTo: z4.string().catch('/'),
});
