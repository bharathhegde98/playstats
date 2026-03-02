export type MatchStatus = "live" | "upcoming" | "finished";

export type MatchType = "tournament" | "individual";

export type SportType = "cricket" | "volleyball" | "badminton";

export type Match = {
  id: number;

  /* Core */
  sport: SportType;
  stage: string;
  status: MatchStatus;

  /* Location + Schedule */
  venue: string;
  location: string;
  date: string;
  startTime: string;

  /* Match Category */
  matchType: MatchType;
  tournamentName?: string;

  /* Cricket Specific */
  format?: string;
  toss?: {
    winner: string;
    decision: "bat" | "field";
  } | null;

  liveInfo?: {
    runsNeeded?: number;
    ballsLeft?: number;
  } | null;

  /* Teams */
  teamA: {
    name: string;

    /* Badminton */
    goals?: number;

    /* Cricket */
    runs?: number;
    wickets?: number;
    overs?: string;

    /* Volleyball */
    setsWon?: number;
    currentSetScore?: number;
  };

  teamB: {
    name: string;

    goals?: number;

    runs?: number;
    wickets?: number;
    overs?: string;

    setsWon?: number;
    currentSetScore?: number;
  };

  /* Badminton Specific */
  matchMinute?: string | null;
  extraTime?: string | null;

  /* Volleyball */
  bestOf?: number;

  /* Result */
  result?: {
    winner: string;
    winBy: string;
  } | null;
};