import { TransactWriteCommand } from "@aws-sdk/lib-dynamodb";
import { docClient } from "../utils/dynamo";
import { BaseRepository } from "./base.repo";

export class BallRepository extends BaseRepository {
  
  async recordBallTransaction(data: any) {
    const { season, matchId, inning, over, ball, batterId, bowlerId, runsScored, extras, isWicket } = data;
    const totalRuns = runsScored + extras;

    // Keys
    const matchPK = this.getPK(season);
    const matchSK = this.getMatchSK(matchId);
    
    // Debug: Log the keys to CloudWatch to ensure they match what's in DynamoDB
    console.log(`[BallRepo] Updating Match Score at PK: ${matchPK}, SK: ${matchSK}`);

    const ballPK = `MATCH#${matchId}`;
    const ballSK = `BALL#${inning}#${over}.${ball}`;
    const batterSK = `PLAYER#${batterId}`;
    const bowlerSK = `PLAYER#${bowlerId}`;

    // Transaction Items
    const transaction = [
      // 1. Save the Ball (Commentary)
      {
        Put: {
          TableName: this.tableName,
          Item: {
            PK: ballPK,
            SK: ballSK,
            type: "BALL",
            ...data,
            createdAt: new Date().toISOString()
          }
        }
      },
      // 2. Update Match Total Score
      {
        Update: {
          TableName: this.tableName,
          Key: { PK: matchPK, SK: matchSK },
          UpdateExpression: inning === 1 
            ? "SET score.teamA = score.teamA + :r, score.overs = :ov"
            : "SET score.teamB = score.teamB + :r, score.overs = :ov",
          ExpressionAttributeValues: {
            ":r": totalRuns,
            ":ov": parseFloat(`${over}.${ball}`)
          }
        }
      },
      // 3. Update Batter Stats (Simulated upsert)
      {
        Update: {
          TableName: this.tableName,
          Key: { PK: ballPK, SK: batterSK },
          UpdateExpression: "ADD runs :r, ballsFaced :b",
          ExpressionAttributeValues: { ":r": runsScored, ":b": 1 }
        }
      },
      // 4. Update Bowler Stats
      {
        Update: {
          TableName: this.tableName,
          Key: { PK: ballPK, SK: bowlerSK },
          UpdateExpression: "ADD runsConceded :r, wickets :w, ballsDelivered :b",
          ExpressionAttributeValues: { 
            ":r": totalRuns, 
            ":w": isWicket ? 1 : 0, 
            ":b": 1 
          }
        }
      }
    ];

    try {
      await docClient.send(new TransactWriteCommand({ TransactItems: transaction }));
      return { success: true, message: "Ball recorded successfully" };
    } catch (err: any) {
      console.error("Transaction Error Details:", JSON.stringify(err, null, 2));
      throw new Error(`DB Error: ${err.message || "Unknown Transaction Failure"}`);
    }
  }
}
