import { gql } from 'graphql-tag';
import { readFileSync } from 'fs';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { container } from '@di/RootModule';
import { Elysia, type Context } from 'elysia';
import { AuthenticatedUserDto } from '@core/common/dto/AuthenticatedUserDto';
import apollo from '@elysiajs/apollo';
import { InfrastructureDITokens } from '@infrastructure/di/InfrastructureDITokens';
import type { SessionResolver } from '@api/graphql/resolvers/session-resolver';
import type { Role } from '@core/common/enums/Role';

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
        .get<SessionResolver>(InfrastructureDITokens.SessionResolver)
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
