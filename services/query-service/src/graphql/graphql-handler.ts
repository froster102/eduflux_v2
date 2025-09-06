import { envVariables } from "@/shared/validation/env-variables";
import {
  ApolloGateway,
  type GraphQLDataSourceProcessOptions,
  IntrospectAndCompose,
  RemoteGraphQLDataSource,
} from "@apollo/gateway";
import Elysia, { type Context } from "elysia";
import apollo from "@elysiajs/apollo";
import { tryCatch } from "@/shared/utils/try-catch";
import { validateToken } from "@/shared/utils/jwt.util";
import { GraphQLError } from "graphql";
import type { AuthUser } from "@/types/auth-user";

class AuthenticatedDataSource extends RemoteGraphQLDataSource {
  willSendRequest({
    request,
    context,
  }: GraphQLDataSourceProcessOptions<SuperGraphContext>): void | Promise<void> {
    if (context.user) {
      request.http?.headers.set("X-User", JSON.stringify(context.user));
    }
  }
}

export interface SuperGraphContext extends Context {
  user?: AuthUser;
}

export const graphqlHandler = new Elysia().use(
  apollo<"/api/graphql", SuperGraphContext>({
    gateway: new ApolloGateway({
      supergraphSdl: new IntrospectAndCompose({
        subgraphs: [
          { name: "user-service", url: envVariables.GRAPHQL_USER_SERVICE_URL },
          // { name: "course-service", url: envVariables.GRAPHQL_COURSE_SERVICE_URL },
          {
            name: "session-service",
            url: envVariables.GRAPHQL_SESSION_SERVICE_URL,
          },
          {
            name: "chat-service",
            url: envVariables.GRAPHQL_CHAT_SERVICE_URL,
          },
        ],
      }),

      buildService: ({ url }) => new AuthenticatedDataSource({ url }),
    }),
    context: async (context) => {
      const tokenFromHeader = context.request.headers
        .get("Authorization")
        ?.split(" ")[1];
      const tokenFromCookie = parseCookieFromHeader(
        context.request.headers.get("Cookie"),
      ).get("user_jwt");

      const token = tokenFromCookie || tokenFromHeader;

      if (token) {
        const { data: payload, error } = await tryCatch(validateToken(token));
        if (error) {
          throw new GraphQLError("Unauthorized", {
            extensions: {
              code: "UNAUTHENTICATED",
              http: { status: 401 },
            },
          });
        }
        if (payload) {
          context.user = payload;
        }
      }
      return context;
    },
    path: "/api/graphql",
  }),
);

function parseCookieFromHeader(header?: string | null) {
  const cookies: Map<string, string> = new Map();
  if (header) {
    header.split(";").forEach((cookie) => {
      const parts = cookie.split("=");
      const key = parts[0].trim();
      const value = decodeURIComponent(parts.slice(1).join("="));
      cookies.set(key, value);
    });
  }
  return cookies;
}
