type CategoryStats = {
  best: { rating: number };
  last: { rating: number };
  record: { win: number; loss: number; draw: number };
};

export type RawProfileStats = {
  chess_rapid: CategoryStats;
};
