const baseUrl = 'https://jackyef-og-img.vercel.app/';

interface Params {
  title: string;
  fontSize?: number;
}

export const createOgImageUrl = ({ title, fontSize = 96 }: Params) => {
  return `${baseUrl}${encodeURIComponent(title)}?fontSize=${fontSize}px`;
};
