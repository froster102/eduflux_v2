import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: './src/infrastructure/graphql/schema/session.graphql',
  generates: {
    './src/infrastructure/graphql/__generated__/resolvers-types.ts': {
      plugins: ['typescript', 'typescript-resolvers'],
      config: {
        federation: true,
        useIndexSignature: true,
        contextType: '../graphql-handler#SubgraphContext',
      },
    },
  },
};
export default config;
