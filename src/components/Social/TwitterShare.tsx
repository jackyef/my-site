interface Props {
  text: string;
  children?: React.ReactNode;
}

export const TwitterShare: React.FC<Props> = ({ text, children }) => (
  <a
    className="inline-block py-1 pointer-coarse:py-3 text-(--color-accent-text) hover:underline text-[14px] font-medium"
    target="_blank"
    rel="noreferrer"
    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`}
    data-size="large"
  >
    {children}
  </a>
);
