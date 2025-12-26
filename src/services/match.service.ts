import { MatchRepository } from "../repositories/match.repo";
import { Match, MatchStatus } from "../models/Match";
import { v4 as uuidv4 } from 'uuid';

const repo = new MatchRepository();

export const matchService = {
  createMatch: async (season: number, teamA: string, teamB: string, startTime: string) => {
    const newMatch: Match = {
      id: uuidv4(),
      season,
      teamA,
      teamB,
      status: MatchStatus.UPCOMING,
      startTime,
      score: { teamA: 0, teamB: 0, overs: 0 }
    };
    return await repo.create(newMatch);
  },

  getMatch: async (season: number, id: string) => {
    return await repo.getById(season, id);
  },

  listMatches: async (season: number) => {
    try {
      console.log(`[MatchService.listMatches] STARTING - Season: ${season}`);
      const result = await repo.list(season);
      console.log(`[MatchService.listMatches] SUCCESS - Got ${result?.length || 0} matches`);
      if (result && result.length > 0) {
        console.log(`[MatchService.listMatches] Sample:`, JSON.stringify(result[0], null, 2));
      }
      return result;
    } catch (error) {
      console.error(`[MatchService.listMatches] ERROR:`, JSON.stringify(error, null, 2));
      throw error;
    }
  },

  listMatchesByStatus: async (season: number, status: MatchStatus) => {
    return await repo.listByStatus(season, status);
  },

  updateStatus: async (season: number, id: string, status: MatchStatus) => {
    return await repo.updateStatus(season, id, status);
  }
};