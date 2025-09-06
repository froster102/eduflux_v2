import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "./src/api/graphql/schema/chat.graphql",
  generates: {
    "./src/api/graphql/__generated__/resolvers-types.ts": {
      plugins: ["typescript", "typescript-resolvers"],
      config: {
        federation: true,
        contextType: "../handler/graphqlHandler#SubgraphContext",
      },
    },
  },
};
export default config;
