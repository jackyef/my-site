interface Props {
  children?: React.ReactNode;
}

export const Code = ({ children }: Props) => (
  <code className="text-red-600 bg-gray-200 inline-block p-1 rounded-md">
    {children}
  </code>
);
