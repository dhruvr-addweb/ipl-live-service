import { PutCommand, GetCommand, QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { docClient } from "../utils/dynamo";
import { BaseRepository } from "./base.repo";
import { Match, MatchStatus } from "../models/Match";
import { INDEXES } from "../constants/table";

export class MatchRepository extends BaseRepository {

  async create(match: Match): Promise<Match> {
    const pk = this.getPK(match.season);
    const sk = this.getMatchSK(match.id);

    // ✅ GSI for status-based listing
    const gsi1pk = `SEASON#${match.season}#STATUS#${match.status}`;
    const gsi1sk = `DATE#${match.startTime}`;

    const item = {
      PK: pk,
      SK: sk,
      GSI1PK: gsi1pk,
      GSI1SK: gsi1sk,
      ...match,
    };

    await docClient.send(
      new PutCommand({
        TableName: this.tableName,
        Item: item,
      })
    );

    return match;
  }

  async getById(season: number, id: string): Promise<Match | null> {
    const pk = this.getPK(season);
    const sk = this.getMatchSK(id);

    const result = await docClient.send(
      new GetCommand({
        TableName: this.tableName,
        Key: { PK: pk, SK: sk },
      })
    );

    return (result.Item as Match) || null;
  }

async list(season: number): Promise<Match[]> {
  const pk = this.getPK(season);

  console.log(`[MatchRepository.list] STARTING - Querying table: ${this.tableName}, PK: ${pk}, Season: ${season}`);

  try {
    const result = await docClient.send(
      new QueryCommand({
        TableName: this.tableName,
        KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
        ExpressionAttributeValues: {
          ":pk": pk,
          ":sk": "MATCH#",
        },
      })
    );

    console.log(`[MatchRepository.list] SUCCESS - Returned ${result.Items?.length || 0} items`);
    console.log(`[MatchRepository.list] First item:`, JSON.stringify(result.Items?.[0], null, 2));
    return (result.Items as Match[]) || [];
  } catch (error) {
    console.error(`[MatchRepository.list] ERROR:`, JSON.stringify(error, null, 2));
    throw error;
  }
}


  async listByStatus(season: number, status: MatchStatus): Promise<Match[]> {
    const gsi1pk = `SEASON#${season}#STATUS#${status}`;

    const result = await docClient.send(
      new QueryCommand({
        TableName: this.tableName,
        IndexName: INDEXES.GSI1,
        KeyConditionExpression: "GSI1PK = :pk",
        ExpressionAttributeValues: {
          ":pk": gsi1pk,
        },
        ScanIndexForward: true, // sort by date ASC
      })
    );

    return (result.Items as Match[]) || [];
  }

async updateStatus(season: number, id: string, status: MatchStatus): Promise<Match> {
  const pk = this.getPK(season);
  const sk = this.getMatchSK(id);

  const gsi1pk = `SEASON#${season}#STATUS#${status}`;
  const gsi1sk = `DATE#${new Date().toISOString()}`;

  const result = await docClient.send(
    new UpdateCommand({
      TableName: this.tableName,
      Key: { PK: pk, SK: sk },
      UpdateExpression: `
        SET 
          #status = :s,
          GSI1PK = :gsiPk,
          GSI1SK = :gsiSk
      `,
      ExpressionAttributeNames: {
        "#status": "status",
      },
      ExpressionAttributeValues: {
        ":s": status,
        ":gsiPk": gsi1pk,
        ":gsiSk": gsi1sk,
      },
      ReturnValues: "ALL_NEW",
    })
  );

  return result.Attributes as Match;
}
}
