export const canUseDOM = typeof window !== 'undefined';

export const isProd = process.env.NODE_ENV === 'production';
