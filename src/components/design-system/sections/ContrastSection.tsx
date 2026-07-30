import { useState } from 'react';

import { SegmentedControl } from '@/components/common/SegmentedControl';
import { Text } from '@/components/common/Text';

import { useTheme } from '@/hooks/useTheme';

import { cn } from '@/utils/styles/classNames';

import {
  CONTRAST_BACKGROUNDS,
  CONTRAST_FOREGROUNDS,
  THEMES,
  type ThemeName,
} from '../constants';
import { contrastRatio, gradeContrast, GRADE_STYLES, parseRgb } from '../color';
import { useResolvedTokens } from '../useResolvedTokens';
import { Block, Section } from '../Scaffold';

const PROBE_TOKENS = [...CONTRAST_FOREGROUNDS, ...CONTRAST_BACKGROUNDS];

const THEME_OPTIONS = THEMES.map((t) => ({
  value: t,
  label: t[0].toUpperCase() + t.slice(1),
}));

const short = (token: string) => token.replace('--color-', '');

export function ContrastSection() {
  const resolved = useResolvedTokens(PROBE_TOKENS);
  const { theme } = useTheme();
  const [selected, setSelected] = useState<ThemeName | null>(null);

  // Default to whatever the visitor is actually in, until they pick otherwise.
  const active: ThemeName = selected ?? theme ?? 'light';
  const values = resolved[active];

  return (
    <Section
      id="contrast"
      eyebrow="Foundations"
      title={
        <>
          Contrast, <em>measured</em>
        </>
      }
      intro="Every ink token against every surface token, computed in the browser with the WCAG 2.1 formula. This grid is the reason the ink ramp has four steps rather than however many looked nice — and it will go red the moment a token drifts."
    >
      <Block
        title="Ink on surface"
        description="AA is the 4.5:1 floor for body text; AAA is 7:1. “AA Large” marks the 3:1 tier — a pass for headings at 18pt+, for bold text at 14pt+, and for UI boundaries, but not for body copy."
        aside={
          <SegmentedControl
            options={THEME_OPTIONS}
            value={active}
            onChange={setSelected}
            className="w-auto"
          />
        }
      >
        <div
          data-theme={active}
          className="overflow-x-auto rounded-xl border border-(--color-border) bg-(--color-bg-panel) p-3"
        >
          <table className="w-full border-collapse min-w-[520px]">
            <thead>
              <tr>
                <th scope="col" className="w-[1%]" />
                {CONTRAST_BACKGROUNDS.map((bg) => (
                  <th
                    key={bg}
                    scope="col"
                    className="px-2 pb-2 font-mono text-[10px] font-medium text-(--color-ink-3) text-center whitespace-nowrap"
                  >
                    {short(bg)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CONTRAST_FOREGROUNDS.map((fg) => (
                <tr key={fg}>
                  <th
                    scope="row"
                    className="pr-3 py-1 font-mono text-[10px] font-medium text-(--color-ink-3) text-right whitespace-nowrap"
                  >
                    {short(fg)}
                  </th>
                  {CONTRAST_BACKGROUNDS.map((bg) => {
                    const fgRgb = parseRgb(values?.[fg] ?? '');
                    const bgRgb = parseRgb(values?.[bg] ?? '');
                    const ratio =
                      fgRgb && bgRgb ? contrastRatio(fgRgb, bgRgb) : null;
                    const grade = ratio ? gradeContrast(ratio) : null;

                    return (
                      <td key={bg} className="p-1">
                        <div
                          className="rounded-md border border-(--color-border) px-2 py-[7px] text-center"
                          style={{ background: values?.[bg] }}
                        >
                          <div
                            className="text-[13px] font-semibold leading-none tabular-nums"
                            style={{ color: values?.[fg] }}
                          >
                            {ratio ? ratio.toFixed(2) : '—'}
                          </div>
                          {grade && (
                            <div
                              className={cn(
                                'mt-[5px] inline-block rounded-full border px-[5px] py-[1px]',
                                'text-[9px] font-semibold leading-none tracking-[0.04em] uppercase',
                                GRADE_STYLES[grade],
                              )}
                            >
                              {grade}
                            </div>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* On ink-3, not ink-4 — a footnote saying "don't put readable text on
            ink-4" has to take its own advice. */}
        <Text variant="caption" color="ink-3" className="mt-3 max-w-[68ch]">
          <code className="font-mono">ink-4</code> is expected to fail here — it
          is a decorative tier, for separator marks, sparkline fills and icons
          that repeat information an adjacent element already carries. Nothing
          that has to be read on its own should use it. Every other row is held
          above the AA line by{' '}
          <code className="font-mono">e2e/contrast.spec.ts</code>, which
          resolves these same tokens in a browser and fails the build if one
          drifts under.
        </Text>
      </Block>
    </Section>
  );
}
