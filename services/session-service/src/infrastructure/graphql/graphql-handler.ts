import { gql } from 'graphql-tag';
import { readFileSync } from 'fs';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { container } from '@/shared/di/container';
import { TYPES } from '@/shared/di/types';
import { type Context, Elysia } from 'elysia';
import apollo from '@elysiajs/apollo';
import { AuthenticatedUserDto } from '@/application/dto/authenticated-user.dto';
import type { SessionResolver } from './resolvers/session-resolver';
import type { Role } from '@/shared/constants/role';

export interface SubgraphContext extends Context {
  user?: AuthenticatedUserDto;
}

export const graphqlHandler = new Elysia().use(
  apollo<'/graphql', SubgraphContext>({
    schema: buildSubgraphSchema({
      typeDefs: gql(
        readFileSync(`${__dirname}/schema/session.graphql`, {
          encoding: 'utf-8',
        }),
      ),
      resolvers: container
        .get<SessionResolver>(TYPES.SessionResolver)
        .getResolvers() as Record<string, any>,
    }),
    context: async (context) => {
      const userHeader = context.request.headers.get('X-User');
      if (userHeader) {
        const parsedUserFromHeader = JSON.parse(userHeader) as {
          id: string;
          name: string;
          email: string;
          roles: Role[];
        };
        context.user = new AuthenticatedUserDto(
          parsedUserFromHeader.id,
          parsedUserFromHeader.name,
          parsedUserFromHeader.email,
          parsedUserFromHeader.roles,
        );
      }

      return Promise.resolve(context);
    },
  }),
);
