type Props = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'search'>;

export const SearchInput = ({ ...props }: Props) => {
  return (
    <input
      className="rounded-lg py-2 px-4 text-lg bg-transparent outline-none w-full"
      type="text"
      {...props}
    />
  );
};
