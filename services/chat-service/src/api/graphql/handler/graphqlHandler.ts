import { AuthenticatedUserDto } from "@core/common/dto/AuthenticatedDto";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { readFileSync } from "fs";
import { container } from "@di/RootModule";
import type { ChatResolver } from "@api/graphql/resolver/ChatResolver";
import { InfrastructureDITokens } from "@infrastructure/di/InfrastructureDITokens";
import { cwd } from "process";
import { Hono, type Context } from "hono";
import { graphqlServer } from "@hono/graphql-server";
import { gql } from "@apollo/client";

export interface SubgraphContext extends Context {
  user?: AuthenticatedUserDto;
}

const schemaPath = `${cwd()}/src/api/graphql/schema/chat.graphql`;

export const graphqlHandler = new Hono().use(
  "/graphql",
  graphqlServer({
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
    // graphiql: true, // if `true`, presents GraphiQL when the GraphQL endpoint is loaded in a browser.
  }),
  // apollo<"/graphql", SubgraphContext>({
  //   schema: buildSubgraphSchema({
  //     typeDefs: gql(
  //       readFileSync(schemaPath, {
  //         encoding: "utf-8",
  //       }),
  //     ),
  //     resolvers: container
  //       .get<ChatResolver>(InfrastructureDITokens.ChatResolver)
  //       .getResolvers() as Record<string, any>,
  //   }),
  //   context: async (context) => {
  //     const userHeader = context.request.headers.get("X-User");
  //     if (userHeader) {
  //       const parsedUserFromHeader = JSON.parse(userHeader) as {
  //         id: string;
  //         name: string;
  //         email: string;
  //         roles: Role[];
  //       };
  //       context.user = new AuthenticatedUserDto(
  //         parsedUserFromHeader.id,
  //         parsedUserFromHeader.name,
  //         parsedUserFromHeader.email,
  //         parsedUserFromHeader.roles,
  //       );
  //     }

  //     return Promise.resolve(context);
  //   },
  // }),
);
