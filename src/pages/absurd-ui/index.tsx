import { BallisticSlider } from '@/components/absurd-components/BallisticSlider';

export default function AbsurdUiPage() {
  return (
    <div className="rounded-lg border border-theme-subtitle p-4">
      <BallisticSlider debug height={300} />
    </div>
  );
}
