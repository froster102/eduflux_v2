import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: './src/application/api/graphql/schema/user.graphql',
  generates: {
    './src/application/api/graphql/__generated__/resolvers-types.ts': {
      plugins: ['typescript', 'typescript-resolvers'],
      config: {
        federation: true,
        contextType:
          './src/application/api/graphql/graphqlHandler.ts/graphql-handler#SubgraphContext',
      },
    },
  },
};
export default config;
