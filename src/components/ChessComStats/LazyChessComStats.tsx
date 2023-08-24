import dynamic from 'next/dynamic';

export const LazyChessComStats = dynamic(
  () =>
    import(/* webpackChunkName: "chesscom-stats" */ './index').then(
      (m) => m.ChessComStats,
    ),
  {
    ssr: false,
    suspense: false,
  },
);
