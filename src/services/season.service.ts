import { logger } from "../utils/logger";

// If you had a separate table for Season metadata, it would go here.
// For now, this is a placeholder for future logic (e.g. "Create Season", "Close Season").
export const seasonService = {
  getSeasonInfo: async (year: number) => {
    logger.info(`Fetching info for season ${year}`);
    return { year, name: `IPL ${year}` };
  }
};