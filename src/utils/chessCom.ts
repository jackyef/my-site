import { ChessComTimeControl } from 'types/chesscom';

const chessComTimeControlSet = new Set<ChessComTimeControl>([
  'rapid',
  'blitz',
  'bullet',
]);

export const isValidTimeControl = (
  timeControl: string,
): timeControl is ChessComTimeControl => {
  return chessComTimeControlSet.has(
    timeControl as unknown as ChessComTimeControl,
  );
};
