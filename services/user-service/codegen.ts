import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: './src/infrastructure/graphql/schema/user.graphql',
  generates: {
    './src/infrastructure/graphql/__generated__/resolvers-types.ts': {
      plugins: ['typescript', 'typescript-resolvers'],
      config: {
        federation: true,
        contextType: '../graphql-handler#RequestContext',
      },
    },
  },
};
export default config;
