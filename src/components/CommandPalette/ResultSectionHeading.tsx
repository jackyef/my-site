import { SectionLabel } from '@/components/common/SectionLabel';

interface Props {
  children?: React.ReactNode;
}

export const ResultSectionHeading = ({ children }: Props) => {
  return (
    <SectionLabel className="px-3 pt-2 pb-1" as="h3">
      {children}
    </SectionLabel>
  );
};
