import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand, BatchWriteCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({ region: process.env.AWS_REGION || 'ap-south-1' });
const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.TABLE_NAME || 'IPL-Matches';

async function clearTable() {
  console.log(`🗑️  Clearing table: ${TABLE_NAME}...`);

  const { Items } = await docClient.send(new ScanCommand({ TableName: TABLE_NAME }));
  
  if (!Items || Items.length === 0) {
    console.log('   ℹ️  Table is empty.');
    return;
  }

  console.log(`   Found ${Items.length} items`);

  const batchSize = 25;
  for (let i = 0; i < Items.length; i += batchSize) {
    const batch = Items.slice(i, i + batchSize);
    await docClient.send(new BatchWriteCommand({
      RequestItems: {
        [TABLE_NAME]: batch.map(item => ({
          DeleteRequest: { Key: { PK: item.PK, SK: item.SK } },
        })),
      },
    }));
    console.log(`   ✅ Deleted batch ${Math.floor(i / batchSize) + 1}`);
  }

  console.log(`✅ Cleared ${Items.length} items!\n`);
}

clearTable()
  .then(() => { console.log('✨ Done!'); process.exit(0); })
  .catch((err) => { console.error('💥 Failed:', err); process.exit(1); });