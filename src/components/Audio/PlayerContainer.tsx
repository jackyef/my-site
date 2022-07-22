interface Props {
  children?: React.ReactNode;
}

export const PlayerContainer = ({ children }: Props) => {
  return (
    <div className="bg-theme-backgroundOffset rounded-md px-4 py-2">
      {children}
    </div>
  );
};
