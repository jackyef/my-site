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

interface Props {
  children?: React.ReactNode;
}

export const CommandPaletteProvider = ({ children }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <CommandPaletteContext.Provider value={{ isOpen, setIsOpen }}>
      <div id="__commandPaletteContainer">{children}</div>
    </CommandPaletteContext.Provider>
  );
};
