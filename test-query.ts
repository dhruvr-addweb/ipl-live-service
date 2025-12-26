import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import dotenv from 'dotenv';

dotenv.config();

const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(client);

async function testQuery() {
  const TABLE_NAME = process.env.TABLE_NAME;
  const season = 2025;
  const pk = `SEASON#${season}`;

  console.log(`Testing query for:`, { TABLE_NAME, PK: pk });

  const result = await docClient.send(
    new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
      ExpressionAttributeValues: {
        ":pk": pk,
        ":sk": "MATCH#",
      },
    })
  );

  console.log(`Found ${result.Items?.length || 0} matches`);
  console.log(`Items:`, JSON.stringify(result.Items, null, 2));
}

testQuery().catch(err => {
  console.error("Error:", err.message);
  process.exit(1);
});
