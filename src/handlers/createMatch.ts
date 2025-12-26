import { matchService } from "../services/match.service";
import { logger } from "../utils/logger";

export const createMatch = async (input: { season: number; teamA: string; teamB: string; startTime: string }) => {
  logger.info("Handling createMatch", input);
  return await matchService.createMatch(input.season, input.teamA, input.teamB, input.startTime);
};