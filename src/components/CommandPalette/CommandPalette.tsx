import * as Dialog from '@radix-ui/react-dialog';
import { useEffect, useState } from 'react';

export default () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey && event.key === 'k') {
        setIsOpen((prev) => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  console.log('command palette render', { isOpen });

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen} modal>
      <Dialog.Overlay>
        <div className="backdrop-blur fixed inset-0 bg-black bg-opacity-30" />
      </Dialog.Overlay>
      <Dialog.Content>Content</Dialog.Content>
      {/* <Dialog.Content>
        <Dialog.Title>title</Dialog.Title>
        <Dialog.Description>description</Dialog.Description>
        <Dialog.Close>close</Dialog.Close>
      </Dialog.Content> */}
    </Dialog.Root>
  );
};
