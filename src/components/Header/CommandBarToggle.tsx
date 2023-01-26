import { useCommandPaletteContext } from '../CommandPalette/hooks/useCommandPaletteContext';

export const CommandBarToggle = () => {
  const { setIsOpen } = useCommandPaletteContext();

  return (
    <button
      className="font-medium text-theme-text hover:text-theme-text rounded-full p-2"
      onClick={() => {
        setIsOpen((prev) => !prev);
      }}
    >
      <code>/cmd</code>
    </button>
  );
};
