import { tryCatch } from '@/shared/utils/try-catch';
import { gql } from 'graphql-tag';
import { readFileSync } from 'fs';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { container } from '@/shared/di/container';
import { TYPES } from '@/shared/di/types';
import Elysia, { Context } from 'elysia';
import apollo from '@elysiajs/apollo';
import { validateToken } from '@/shared/utils/jwt.util';
import { AuthenticatedUserDto } from '@/application/dto/authenticated-user.dto';
import { UserResolver } from './resolvers/user-resolver';

export interface RequestContext extends Context {}

export const graphqlHandler = new Elysia().use(
  apollo<'/graphql', Context>({
    schema: buildSubgraphSchema({
      typeDefs: gql(
        readFileSync(`${__dirname}/schema/user.graphql`, {
          encoding: 'utf-8',
        }),
      ),
      resolvers: container
        .get<UserResolver>(TYPES.UserResolver)
        .getResolvers() as Record<string, any>,
    }),
    context: async (context) => {
      const token = context.request.headers.get('Authorization')?.split(' ')[1];
      if (token) {
        const { data: payload } = await tryCatch(validateToken(token));
        if (payload) {
          const user = new AuthenticatedUserDto(
            payload.id,
            payload.name,
            payload.email,
            payload.roles,
          );
          context.store['user'] = user;
        }
      }
      return context;
    },
  }),
);
