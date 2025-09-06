import { AuthenticatedUserDto } from "@core/common/dto/AuthenticatedDto";
import { Elysia, type Context } from "elysia";
import { buildSubgraphSchema } from "@apollo/subgraph";
import apollo, { gql } from "@elysiajs/apollo";
import { readFileSync } from "fs";
import { container } from "@di/RootModule";
import type { ChatResolver } from "@api/graphql/resolver/ChatResolver";
import { InfrastructureDITokens } from "@infrastructure/di/InfrastructureDITokens";
import { cwd } from "process";

export interface SubgraphContext extends Context {
  user?: AuthenticatedUserDto;
}

const schemaPath = `${cwd()}/src/api/graphql/schema/chat.graphql`;

export const graphqlHandler = new Elysia().use(
  apollo<"/graphql", SubgraphContext>({
    schema: buildSubgraphSchema({
      typeDefs: gql(
        readFileSync(schemaPath, {
          encoding: "utf-8",
        }),
      ),
      resolvers: container
        .get<ChatResolver>(InfrastructureDITokens.ChatResolver)
        .getResolvers() as Record<string, any>,
    }),
    context: async (context) => {
      const userHeader = context.request.headers.get("X-User");
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
