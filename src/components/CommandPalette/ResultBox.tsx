export const ResultBox: React.FC = ({ children }) => {
  return (
    <>
      <div className="my-4 h-[2px] w-full bg-theme-backgroundOffset opacity-60 transition-colors duration-500" />
      <div
        role="listbox"
        aria-label="available actions or results"
        className="mt-4"
      >
        {children}
      </div>
    </>
  );
};
