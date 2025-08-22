import { envVariables } from "../validation/env-variables";

export const graphqlServerConfig = {
  PORT: envVariables.GRAPHQL_SERVER_PORT,
  GRAPHQL_USER_SERVICE_URL: envVariables.GRAPHQL_USER_SERVICE_URL,
  GRAPHQL_COURSE_SERVICE_URL: envVariables.GRAPHQL_COURSE_SERVICE_URL,
  GRAPHQL_SESSION_SERVICE_URL: envVariables.GRAPHQL_SESSION_SERVICE_URL,
};
