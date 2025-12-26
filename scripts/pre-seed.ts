// scripts/pre-seed.ts

import dotenv from 'dotenv';
dotenv.config();
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, BatchWriteCommand } from '@aws-sdk/lib-dynamodb';
import { seedItems } from './pre-seed-data-full';

if (!process.env.TABLE_NAME) {
  throw new Error('❌ TABLE_NAME is not set');
}

if (!process.env.AWS_REGION) {
  throw new Error('❌ AWS_REGION is not set');
}

const TABLE_NAME = process.env.TABLE_NAME;
const REGION = process.env.AWS_REGION;

const client = new DynamoDBClient({ region: REGION });
const docClient = DynamoDBDocumentClient.from(client);

type SeedItem = {
  PK: string;
  SK: string;
  [key: string]: any;
};

const BATCH_SIZE = 25;

async function preSeedDatabase() {
  console.log(`🌱 Starting IPL 2025 Pre-Seeding`);
  console.log(`📍 Table: ${TABLE_NAME}`);
  console.log(`🌍 Region: ${REGION}`);
  console.log(`📦 Total items: ${seedItems.length}\n`);

  for (let i = 0; i < seedItems.length; i += BATCH_SIZE) {
    const batch = seedItems.slice(i, i + BATCH_SIZE);

    await docClient.send(
      new BatchWriteCommand({
        RequestItems: {
          [TABLE_NAME]: batch.map((item: SeedItem) => ({
            PutRequest: { Item: item },
          })),
        },
      })
    );

    console.log(`✅ Inserted batch ${i / BATCH_SIZE + 1}`);
  }

  console.log('\n🎉 Pre-Seeding Completed Successfully!');
}

preSeedDatabase()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('\n💥 Pre-Seeding Failed:', err);
    process.exit(1);
  });
