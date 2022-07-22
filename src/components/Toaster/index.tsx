import dynamic from 'next/dynamic';
import type {
  DefaultToastOptions,
  Toast,
  ToastPosition,
} from 'react-hot-toast/dist/core/types';

interface ToasterProps {
  position?: ToastPosition;
  toastOptions?: DefaultToastOptions;
  reverseOrder?: boolean;
  gutter?: number;
  containerStyle?: React.CSSProperties;
  containerClassName?: string;
  children?: (toast: Toast) => JSX.Element;
}

export const Toaster = dynamic<ToasterProps>(
  () => import('react-hot-toast').then((m) => m.Toaster),
  {
    loading: () => null,
    ssr: false,
  },
);
