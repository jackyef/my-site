type Props = JSX.IntrinsicAttributes &
  React.HTMLAttributes<HTMLHeadingElement> & {
    children?: React.ReactNode;
  };

export const H1 = ({ children, ...rest }: Props) => {
  return (
    <h1
      className="text-3xl md:text-5xl font-bold font-heading text-theme-heading"
      {...rest}
    >
      {children}
    </h1>
  );
};

export const H2 = ({ children, ...rest }: Props) => {
  return (
    <h2
      className="text-2xl md:text-3xl font-bold font-heading text-theme-heading"
      {...rest}
    >
      {children}
    </h2>
  );
};

export const H3 = ({ children, ...rest }: Props) => {
  return (
    <h3
      className="text-xl md:text-2xl font-bold font-heading text-theme-heading"
      {...rest}
    >
      {children}
    </h3>
  );
};

export const H4 = ({ children, ...rest }: Props) => {
  return (
    <h4
      className="text-lg md:text-xl font-bold font-heading text-theme-heading"
      {...rest}
    >
      {children}
    </h4>
  );
};

export const H5 = ({ children, ...rest }: Props) => {
  return (
    <h5
      className="text-lg md:text-xl font-italic font-heading text-theme-heading"
      {...rest}
    >
      {children}
    </h5>
  );
};
