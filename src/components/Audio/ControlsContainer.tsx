interface Props {
  children?: React.ReactNode;
}

export const ControlsContainer = ({ children }: Props) => {
  return <div className="flex space-x-4">{children}</div>;
};
