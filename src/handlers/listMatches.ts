import { matchService } from "../services/match.service";

export const listMatches = async (season: number) => {
  try {
    const result = await matchService.listMatches(season);
    console.log(`listMatches handler: Found ${result?.length || 0} matches for season ${season}`);
    return result;
  } catch (error) {
    console.error(`listMatches handler error:`, error);
    throw error;
  }
};