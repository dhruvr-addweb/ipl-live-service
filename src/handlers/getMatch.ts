import { matchService } from "../services/match.service";
import { logger } from "../utils/logger";

export const getMatch = async (season: number, id: string) => {
  logger.info(`Fetching match ${id} for season ${season}`);
  return await matchService.getMatch(season, id);
};