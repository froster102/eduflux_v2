import { buildSubgraphSchema } from '@apollo/subgraph';
import Elysia, { type Context } from 'elysia';
import gql from 'graphql-tag';
import { UserResolver } from 'src/application/api/graphql/resolvers/UserResolver';
import { readFileSync } from 'fs';
import apollo from '@elysiajs/apollo';
import { container } from '@application/di/RootModule';
import { InfrastructureDITokens } from '@infrastructure/di/InfrastructureDITokens';
import { JwtUtil } from '@shared/utils/JwtUtil';
import { tryCatch } from '@shared/utils/try-catch';
import { AuthenticatedUserDto } from '@core/common/dto/AuthenticatedDto';

export interface SubgraphContext extends Context {
  user?: AuthenticatedUserDto;
}

export const graphqlHandler = new Elysia().use(
  apollo<'/graphql', SubgraphContext>({
    schema: buildSubgraphSchema({
      typeDefs: gql(
        readFileSync(`${__dirname}/schema/user.graphql`, {
          encoding: 'utf-8',
        }),
      ),
      resolvers: container
        .get<UserResolver>(InfrastructureDITokens.UserResolvers)
        .getResolvers() as Record<string, any>,
    }),
    context: async (context) => {
      const token = context.request.headers.get('Authorization')?.split(' ')[1];
      if (token) {
        const { data: payload } = await tryCatch(JwtUtil.validateToken(token));
        if (payload) {
          const user = new AuthenticatedUserDto(
            payload.id,
            payload.name,
            payload.email,
            payload.roles,
          );
          context.user = user;
        }
      }
      return context;
    },
  }),
);
