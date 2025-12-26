import { ApolloServer } from '@apollo/server';
import { readFileSync } from 'fs';
import { join } from 'path';
import { resolvers } from './src/graphql/resolvers';
import dotenv from 'dotenv';

dotenv.config();

// Load Schema
const typeDefs = readFileSync(join(__dirname, 'src/graphql', 'schema.graphql'), { encoding: 'utf-8' });

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

async function testGraphQL() {
  const query = `
    query listMatches($season: Int!) {
      listMatches(season: $season) {
        id
        season
        teamA
        teamB
        status
        startTime
      }
    }
  `;

  const result = await server.executeOperation({
    query,
    variables: { season: 2025 }
  });

  console.log('GraphQL Result:');
  console.log(JSON.stringify(result, null, 2));
}

testGraphQL().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
