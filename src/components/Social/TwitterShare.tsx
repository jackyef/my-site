interface Props {
  text: string;
}

export const TwitterShare: React.FC<Props> = ({ text, children }) => (
  <a
    className="text-teal-600 hover:text-teal-400 hover:underline"
    target="_blank"
    rel="noreferrer"
    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`}
    data-size="large"
  >
    {children}
  </a>
);
