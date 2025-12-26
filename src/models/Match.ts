export interface Score {
  teamA: number;
  teamB: number;
  overs: number;
}

export enum MatchStatus {
  UPCOMING = "UPCOMING",
  LIVE = "LIVE",
  COMPLETED = "COMPLETED"
}

export interface Match {
  id: string;
  season: number;
  teamA: string;
  teamB: string;
  status: MatchStatus;
  startTime: string;
  score?: Score;
}