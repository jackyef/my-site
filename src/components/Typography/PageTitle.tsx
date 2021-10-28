export const PageTitle: React.FC = ({ children, ...rest }) => {
  return (
    <h1 className="text-3xl md:text-5xl font-bold text-theme-heading" {...rest}>
      {children}
    </h1>
  );
};
