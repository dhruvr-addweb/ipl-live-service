import { createMatch } from '../handlers/createMatch';
import { getMatch } from '../handlers/getMatch';
import { listMatches } from '../handlers/listMatches';
import { listMatchesByStatus } from '../handlers/listMatchesByStatus';
import { addScore } from '../handlers/addScore';
import { updateMatchStatus } from '../handlers/updateMatchStatus';
import { MatchStatus } from '../models/Match';

// --- Interface Definitions for Arguments ---
interface GetMatchArgs {
    season: number;
    id: string;
}

interface ListMatchesArgs {
    season: number;
}

interface ListMatchesByStatusArgs {
    season: number;
    status: MatchStatus;
}

interface CreateMatchArgs {
    season: number;
    teamA: string;
    teamB: string;
    startTime: string;
}

interface AddScoreArgs {
    season: number;
    id: string;
    teamA: number;
    teamB: number;
    overs: number;
}

interface UpdateStatusArgs {
    season: number;
    id: string;
    status: MatchStatus;
}

// --- Resolvers ---
export const resolvers = {
    Query: {
        // We use '_: any' to tell TypeScript to ignore the parent argument type
        getMatch: (_: any, args: GetMatchArgs) =>
            getMatch(args.season, args.id),

        listMatches: (_: any, args: ListMatchesArgs) =>
            listMatches(args.season),

        listMatchesByStatus: (_: any, args: ListMatchesByStatusArgs) =>
            listMatchesByStatus(args.season, args.status),
    },

    Mutation: {
        createMatch: (_: any, args: CreateMatchArgs) =>
            createMatch(args),

        // This now correctly calls the 'addScore' HANDLER, not the service directly
        addScore: (_: any, args: AddScoreArgs) =>
            addScore(args.season, args.id, args.teamA, args.teamB, args.overs),

        updateMatchStatus: (_: any, args: UpdateStatusArgs) =>
            updateMatchStatus(args.season, args.id, args.status),
    },
};