const baseUrl = 'https://jackyef-og-img.vercel.app/';

interface Params {
  title: string;
}

export const createOgImageUrl = ({ title }: Params) => {
  return `${baseUrl}${encodeURIComponent(title)}?theme=dark&md=1&fontSize=150px`;
};
