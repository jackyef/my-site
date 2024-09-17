export const canUseDOM = typeof window !== 'undefined';

export const isProd = process.env.NODE_ENV === 'production';

export const publicUrl = process.env.NEXT_PUBLIC_URL;

// This is my chess.com information
// If you are copying this, remember to change this.
export const chessComUserId = '344047395';
export const chessComUsername = 'PixelParser';
