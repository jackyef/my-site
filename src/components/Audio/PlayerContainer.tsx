interface Props {
  children?: React.ReactNode;
}

export const PlayerContainer = ({ children }: Props) => {
  return <div className="bg-surface-3 rounded-md px-4 py-2">{children}</div>;
};
