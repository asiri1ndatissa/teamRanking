export interface RoundResults {
  homeTeam: {
    roundsWin: string;
  };
  awayTeam: {
    roundsWin: string;
  };
}

export interface FinalResults {
  homeTeam: {
    mapWin: string;
  };
  awayTeam: {
    mapWin: string;
  };
}

export interface Match {
  matchNumber: string;
  roundNo: string;
  timeCompeted: string;
  mapWins: string[];
  homeTeam: string;
  awayTeam: string;
  finalResults: FinalResults;
  roundResults: {
    [key: string]: RoundResults;
  };
}

export interface Stage {
  stage: string;
  matches: Match[];
}

export interface SeasonInfo {
  season: string;
  stages: Stage[];
}

export interface TeamStat {
  wins: number;
  losses: number;
  mapWon: number;
  mapLoss: number;
  roundsWon: number;
  roundsLost: number;
  opponents: any[];
  matchesWin: any[];
  matchesLoses: any[];
}

