import { ScoreRepository } from "../repositories/score.repo";
import { logger } from "../utils/logger";

const repo = new ScoreRepository();

export const scoreService = {
  addScore: async (season: number, matchId: string, teamA: number, teamB: number, overs: number) => {
    // Validation logic could go here (e.g. overs cannot be > 20)
    if (overs > 20) {
      throw new Error("Overs cannot exceed 20");
    }
    
    logger.info(`Updating score for match ${matchId}`);
    return await repo.updateScore(season, matchId, { teamA, teamB, overs });
  }
};