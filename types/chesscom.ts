type CategoryStats = {
  best: { rating: number };
  last: { rating: number };
  record: { win: number; loss: number; draw: number };
};

interface History {
  timestamp: number;
  rating: number;
  day_close_rating: number;
  day: number;
}

interface ResultTypeCount {
  win: Win;
  loss: Loss;
  draw: Draw;
}

interface Win {
  resigned: number;
  checkmated: number;
  timeout: number;
  abandoned: number;
}

interface Loss {
  resigned: number;
  timeout: number;
  checkmated: number;
}

interface Draw {
  repetition: number;
  insufficient: number;
  '50move': number;
  stalemate: number;
}

interface BestWinGame {
  id: number;
  player: string;
  rating: number;
}

interface Stats {
  rating_delta: number;
  history: History[];
  count: number;
  rated_count: number;
  opponent_rating_avg: number;
  opponent_rating_win_avg: number;
  opponent_rating_draw_avg: number;
  opponent_rating_loss_avg: number;
  white_win_count: number;
  white_draw_count: number;
  white_loss_count: number;
  black_win_count: number;
  black_draw_count: number;
  black_loss_count: number;
  rating_last: number;
  rating_first: number;
  rating_max: number;
  rating_max_timestamp: number;
  moves_count: number;
  streak_last: number;
  streak_max: number;
  streak_max_timestamp: number;
  opponent_rating_max: number;
  opponent_rating_max_timestamp: number;
  opponent_rating_max_uuid: string;
  result_type_count: ResultTypeCount;
  best_win_game: BestWinGame;
  accuracy_count: number;
  accuracy_avg: number;
  starting_day: number;
}

export type RawProfileStats = {
  chess_rapid: CategoryStats;
};

export type RawAllTimeStats = {
  stats: Stats;
  progress: number;
  shouldShowGlobalRankAndPercentile: boolean;
};

export type RawMatchData = {
  id: number;
  fen: string;
  daysPerTurn: number;
  moves: number;
  user1Rating: number;
  user2Rating: number;
  user1Result: number;
  user2Result: number;
  isTournament: boolean;
  isTeamMatch: boolean;
  highlightSquares: string;
  gameEndTime: string; // Formatted data e.g.: Aug 22, 2023
  isTimeout: boolean;
  isLive: boolean;
  isVsComputer: boolean;
  gameType: GameType;
  gameTimeClass: string; // An enum, can be 'standard', etc. Rapid is 'standard'
  baseTime1: number;
  timeIncrement: number;
  user1: User;
  user2: User;
  isArena: boolean;
  user1Accuracy: number | null;
  user2Accuracy: number | null;
};

export type GameType = {
  name: Name;
  code: Code;
  isChess960: boolean;
  isKingOfTheHill: boolean;
  isThreeCheck: boolean;
  isBughouse: boolean;
  isCrazyHouse: boolean;
};

export enum Code {
  Chess = 'chess',
}

export enum Name {
  StandardChess = 'Standard Chess',
}

export type User = {
  id: number;
  title: null;
  username: string;
  countryId: number;
  countryName: string;
  membershipLevel: number;
  flairCode: string;
};
