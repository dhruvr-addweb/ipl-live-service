import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { docClient } from "../utils/dynamo";
import { BaseRepository } from "./base.repo";
import { Score } from "../models/Score";

export class ScoreRepository extends BaseRepository {
  async updateScore(season: number, matchId: string, score: Score) {
    const pk = this.getPK(season);
    const sk = this.getMatchSK(matchId);

    const command = new UpdateCommand({
      TableName: this.tableName,
      Key: { PK: pk, SK: sk },
      UpdateExpression: "SET score = :s",
      ExpressionAttributeValues: {
        ":s": score,
      },
      ReturnValues: "ALL_NEW",
    });

    const result = await docClient.send(command);
    return result.Attributes;
  }
}