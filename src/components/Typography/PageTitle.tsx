type Props = React.HTMLAttributes<HTMLHeadingElement> & {
  children?: React.ReactNode;
};

export const PageTitle = ({ children, ...rest }: Props) => {
  return (
    <h1 className="text-3xl md:text-5xl font-bold text-theme-heading" {...rest}>
      {children}
    </h1>
  );
};
