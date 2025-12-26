import { scoreService } from "../services/score.service";
import { logger } from "../utils/logger";

export const addScore = async (season: number, id: string, teamA: number, teamB: number, overs: number) => {
  logger.info("Handler: addScore", { season, id, teamA, teamB, overs });
  
  // Validate inputs
  if (!id) throw new Error("Match ID is required");
  if (teamA < 0 || teamB < 0) throw new Error("Scores cannot be negative");
  if (overs < 0 || overs > 20) throw new Error("Overs must be between 0 and 20");
  
  return await scoreService.addScore(season, id, teamA, teamB, overs);
};