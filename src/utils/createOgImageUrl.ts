const baseUrl = 'https://jackyef-og-img.vercel.app/Hi%2C%20I%20am%20**Jacky**!%20%20%F0%9F%91%8B.png?theme=dark&md=1&fontSize=150px';

interface Params {
  title: string;
}

export const createOgImageUrl = ({ title }: Params) => {
  return `${baseUrl}${encodeURIComponent(title)}?theme=dark&md=1&fontSize=150px`;
};
