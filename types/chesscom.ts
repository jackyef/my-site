type CategoryStats = {
  best: { rating: number };
  last: { rating: number };
  record: { win: number; loss: number; draw: number };
};

export type RawProfileStats = {
  chess_rapid: CategoryStats;
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
