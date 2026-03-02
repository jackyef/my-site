interface Props {
  children?: React.ReactNode;
}

export const PlayerContainer = ({ children }: Props) => {
  return (
    <div className="bg-(--color-bg-panel) border border-(--color-border) rounded-md px-4 py-2">
      {children}
    </div>
  );
};
