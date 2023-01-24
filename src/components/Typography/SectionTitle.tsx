type Props = React.HTMLAttributes<HTMLHeadingElement> & {
  children?: React.ReactNode;
};

export const SectionTitle = ({ children, ...rest }: Props) => {
  return (
    <h2
      className="text-2xl md:text-3xl font-bold font-heading text-theme-heading"
      {...rest}
    >
      {children}
    </h2>
  );
};
