interface Props {
  children?: React.ReactNode;
}

export const LineLoader = ({ children }: Props) => {
  return (
    <div className="inline-block animate-pulse bg-gray-400">{children}</div>
  );
};
