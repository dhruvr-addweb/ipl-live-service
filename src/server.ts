import { ApolloServer } from '@apollo/server';
import { startServerAndCreateLambdaHandler, handlers } from '@as-integrations/aws-lambda';
import { readFileSync } from 'fs';
import { join } from 'path';
import { resolvers } from './graphql/resolvers';

// Load Schema
const typeDefs = readFileSync(join(__dirname, 'graphql', 'schema.graphql'), { encoding: 'utf-8' });

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

export const handler = startServerAndCreateLambdaHandler(
  server as any,
  handlers.createAPIGatewayProxyEventRequestHandler(),
);