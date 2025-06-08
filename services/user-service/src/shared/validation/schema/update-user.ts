import { t } from 'elysia';

export const updateUserSchema = t.Object({
  firstName: t.String({
    minLength: 2,
    maxLength: 50,
    description: "User's first name",
  }),
  lastName: t.String({
    minLength: 2,
    maxLength: 50,
    description: "User's last name",
  }),
  imageUrl: t.Optional(
    t.String({
      format: 'uri',
    }),
  ),
  bio: t.Optional(
    t.String({
      maxLength: 500,
      description: "User's biography",
    }),
  ),
  socialLinks: t.Optional(
    t.Array(
      t.Object(
        {
          plattform: t.String({
            enum: [
              'x',
              'facebook',
              'instagram',
              'linkedin',
              'youtube',
              'website',
            ],
            description: 'Platform name for the social link',
          }),
          url: t.String({
            format: 'uri',
            description: 'URL for the social link',
          }),
        },
        {
          description: 'A social media link object',
        },
      ),
    ),
  ),
});
