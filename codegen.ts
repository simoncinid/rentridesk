import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: process.env['HASURA_GRAPHQL_ENDPOINT'] ?? 'http://localhost:1337/v1/graphql',
  documents: ['apps/web/src/**/*.graphql'],
  generates: { 'packages/graphql/src/generated/': { preset: 'client', plugins: [] } },
  ignoreNoDocuments: true,
};
export default config;
