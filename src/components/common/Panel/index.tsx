import * as React from 'react';

import { StatusDot } from '@/components/common/StatusDot';

import { cn } from '@/utils/styles/classNames';

type PanelType = 'info' | 'warning' | 'danger' | 'success' | 'accent';

interface Props {
  type: PanelType;
  title: string;
  children?: React.ReactNode;
}

/**
 * Each type is a semantic colour plus its matching tint.
 *
 * The colour deliberately never lands on text. Measured against their own
 * tints in the light theme, the semantic foregrounds run from 2.58:1
 * (success) to 4.75:1 (info), so a coloured title would fail AA for half the
 * set. The colour lives in the border and the marker dot — both decorative —
 * and every word stays on ink.
 */
const STYLES: Record<PanelType, { accent: string; bg: string }> = {
  info: { accent: '--color-info', bg: 'bg-(--color-info-bg)' },
  warning: { accent: '--color-warning', bg: 'bg-(--color-warning-bg)' },
  danger: { accent: '--color-danger', bg: 'bg-(--color-danger-bg)' },
  success: { accent: '--color-success', bg: 'bg-(--color-success-bg)' },
  accent: { accent: '--color-accent', bg: 'bg-(--color-accent-xl)' },
};

export const Panel: React.FC<Props> = ({
  type = 'info',
  title = '',
  children,
}) => {
  const { accent, bg } = STYLES[type];

  return (
    <div
      className={cn('my-8 rounded-xl border px-5 py-[18px] not-prose', bg)}
      style={{
        // Mixed from the semantic colour rather than taking --color-border, so
        // the edge stays in the family without needing a token per type per
        // theme. Reads as a hairline, not a rule.
        borderColor: `color-mix(in srgb, var(${accent}) 30%, transparent)`,
      }}
    >
      <div className="relative pl-[17px]">
        {/* Centred on the title's first line: 17px at leading-snug is a ~23px
            line box, so the 7px dot starts 8px down. */}
        <StatusDot
          color={`var(${accent})`}
          pulse={false}
          className="absolute left-0 top-[8px]"
        />
        <p className="font-serif font-bold text-[17px] leading-snug text-(--color-ink) m-0">
          {title}
        </p>
        {children && (
          <div className="mt-2 text-[15px] leading-relaxed text-(--color-ink-2) [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};
