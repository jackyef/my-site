interface Props {
  text: string;
  children?: React.ReactNode;
}

export const TwitterShare: React.FC<Props> = ({ text, children }) => (
  <a
    className="text-theme-link hover:underline"
    target="_blank"
    rel="noreferrer"
    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`}
    data-size="large"
  >
    {children}
  </a>
);
