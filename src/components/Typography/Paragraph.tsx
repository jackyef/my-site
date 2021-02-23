interface Props {
  className?: string;
}

export const Paragraph: React.FC<Props> = ({ children, className = '' }) => {
  return (
    <p className={`text-md text-theme-text md:text-lg mt-4 ${className}`}>
      {children}
    </p>
  );
};
