import { createContext, Dispatch, SetStateAction, useState } from 'react';

type CommandPaletteProviderProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

export const CommandPaletteContext = createContext<CommandPaletteProviderProps>(
  {
    isOpen: false,
    setIsOpen: () => {},
  },
);

export const CommandPaletteProvider: React.FC = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <CommandPaletteContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </CommandPaletteContext.Provider>
  );
};
