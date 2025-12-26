import { matchService } from "../services/match.service";
import { MatchStatus } from "../models/Match";
import { logger } from "../utils/logger";

export const updateMatchStatus = async (season: number, id: string, status: MatchStatus) => {
  logger.info(`Updating status for match ${id} to ${status}`);
  return await matchService.updateStatus(season, id, status);
};