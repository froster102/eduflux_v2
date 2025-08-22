import { GraphQLClient } from "graphql-request";

import { API_BASE_URL } from "../constants";

export const graphqlClient = new GraphQLClient(`${API_BASE_URL}/graphql`, {
  credentials: "include",
});
