import { matchService } from "../services/match.service";
import { MatchStatus } from "../models/Match";
import { logger } from "../utils/logger";

export const listMatchesByStatus = async (season: number, status: MatchStatus) => {
  logger.info(`Listing matches for season ${season} with status ${status}`);
  return await matchService.listMatchesByStatus(season, status);
};