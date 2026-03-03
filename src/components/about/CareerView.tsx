import { useRef, useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';

import { Card } from '@/components/common/Card';
import { Chip } from '@/components/common/Chip';
import { PageHeader } from '@/components/common/PageHeader';
import { timelineEvents } from '@/components/HistoryCalendar/constants';
import { TODAY, formatMonth, getTimeDifference } from '@/lib/datetime';

const VARIANT_COLORS: Record<string, string> = {
  amber: '#f59e0b',
  sky: '#0ea5e9',
  green: '#22c55e',
  blue: '#3b82f6',
  fuchsia: '#d946ef',
  teal: '#14b8a6',
  red: '#ef4444',
  slate: '#64748b',
  violet: '#8b5cf6',
};

const ORG_URLS: Record<string, string> = {
  'Sticker Mule': 'https://www.stickermule.com',
  Tokopedia: 'https://www.tokopedia.com',
};

const CHART_START = 2013;
// 200px per year → ~3.5 years visible in a ~700px container
const YEAR_PX = 200;

// Oldest first so bars flow left → right
const CHART_ITEMS = [...timelineEvents].reverse();

function dateToYear(d: Date): number {
  return d.getFullYear() + d.getMonth() / 12;
}

function yearToPx(year: number): number {
  return (year - CHART_START) * YEAR_PX;
}

// Chart ends exactly at today — right edge of the last bar = right edge of the chart
const TODAY_PX = yearToPx(dateToYear(TODAY));
const CHART_WIDTH = TODAY_PX + 1; // +1 so the today line isn't clipped

const YEAR_LABELS = Array.from(
  { length: Math.floor(dateToYear(TODAY)) - CHART_START + 1 },
  (_, i) => CHART_START + i,
);

function periodLabel(from: Date, to: Date, isCurrent: boolean): string {
  const fromStr = formatMonth(from, true, 'en-US', 'short') ?? '';
  const toStr = isCurrent
    ? 'Present'
    : formatMonth(to, true, 'en-US', 'short') ?? '';
  const duration = getTimeDifference(from, isCurrent ? TODAY : to);
  return `${fromStr} – ${toStr} · ${duration}`;
}

export function CareerView() {
  const [selected, setSelected] = useState<number>(CHART_ITEMS.length - 1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const barRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleBarClick = useCallback((i: number) => {
    setSelected(i);
  }, []);

  const selectedItem = CHART_ITEMS[selected];
  const isCurrent = selectedItem.to >= TODAY;
  const dotColor =
    VARIANT_COLORS[selectedItem.variant] ?? 'var(--color-accent)';
  const orgUrl = ORG_URLS[selectedItem.description];

  // Scroll the chart to the selected bar once it's near the viewport center
  useEffect(() => {
    const chart = scrollRef.current;
    if (!chart) return;

    let done = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (done || !entry.isIntersecting) return;
        done = true;
        observer.disconnect();

        chart.scrollTo({
          left: Math.max(
            0,
            (barRefs.current[selected]?.offsetLeft ?? 0) -
              chart.clientWidth / 2,
          ),
          behavior: 'smooth',
        });
      },
      { rootMargin: '-30% 0px -30% 0px', threshold: 0 },
    );

    observer.observe(chart);
    return () => observer.disconnect();
    // We only want to trigger this once, so we are not listening for `selected`
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="page-pad">
      <PageHeader
        eyebrow="Career"
        title={
          <>
            Work <em>history.</em>
          </>
        }
      />

      {/* Gantt Chart */}
      <div ref={scrollRef} style={{ overflowX: 'auto', marginBottom: 20 }}>
        <div style={{ paddingBottom: 4 }}>
          {/* Year axis labels */}
          <div style={{ marginBottom: 6 }}>
            <div
              style={{
                width: CHART_WIDTH,
                position: 'relative',
                height: 18,
              }}
            >
              {YEAR_LABELS.map((y) => (
                <div
                  key={y}
                  style={{
                    position: 'absolute',
                    left: yearToPx(y),
                    transform: 'translateX(-50%)',
                    fontSize: 11,
                    color: 'var(--color-ink-4)',
                    fontWeight: 500,
                    userSelect: 'none',
                  }}
                >
                  {y}
                </div>
              ))}
            </div>
          </div>

          {/* Bar rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {CHART_ITEMS.map((item, i) => {
              const startPx = yearToPx(dateToYear(item.from));
              const endDate = item.to >= TODAY ? TODAY : item.to;
              const endPx = yearToPx(dateToYear(endDate));
              const widthPx = Math.max(endPx - startPx, 8);
              const isSelected = selected === i;
              const barColor =
                VARIANT_COLORS[item.variant] ?? 'var(--color-accent)';

              return (
                <div key={i} style={{ height: 32 }}>
                  {/* Bar area */}
                  <div
                    style={{
                      width: CHART_WIDTH,
                      flexShrink: 0,
                      position: 'relative',
                      height: '100%',
                    }}
                  >
                    {/* Year grid lines */}
                    {YEAR_LABELS.map((y) => (
                      <div
                        key={y}
                        style={{
                          position: 'absolute',
                          left: yearToPx(y),
                          top: 0,
                          bottom: 0,
                          width: 1,
                          background: 'var(--color-border)',
                        }}
                      />
                    ))}

                    {/* Today line */}
                    <div
                      style={{
                        position: 'absolute',
                        left: yearToPx(dateToYear(TODAY)),
                        top: 0,
                        bottom: 0,
                        width: 1.5,
                        background: 'var(--color-accent)',
                        opacity: 0.5,
                      }}
                    />

                    {/* Bar */}
                    <button
                      ref={(btn) => {
                        barRefs.current[i] = btn;
                      }}
                      data-index={i}
                      onClick={() => handleBarClick(i)}
                      title={`${item.title} @ ${item.description}`}
                      style={{
                        position: 'absolute',
                        left: startPx,
                        width: widthPx,
                        top: 3,
                        bottom: 3,
                        borderRadius: 5,
                        background: isSelected
                          ? barColor
                          : 'var(--color-bg-hover)',
                        border: `1.5px solid ${
                          isSelected ? barColor : 'var(--color-border)'
                        }`,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        paddingLeft: 7,
                        paddingRight: 4,
                        overflow: 'hidden',
                        fontSize: 10,
                        fontWeight: 600,
                        color: isSelected ? '#fff' : 'var(--color-ink-3)',
                        whiteSpace: 'nowrap',
                        transition:
                          'background 0.15s, border-color 0.15s, color 0.15s',
                        fontFamily: 'inherit',
                      }}
                    >
                      {item.title}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Detail panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selected}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.16 }}
        >
          <Card padding="md" className="max-h-[420px] overflow-y-auto">
            {/* Period + current badge */}
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[12px] text-[var(--color-ink-4)]">
                {periodLabel(selectedItem.from, selectedItem.to, isCurrent)}
              </span>
              {isCurrent && (
                <Chip variant="highlight" size="xs">
                  Current
                </Chip>
              )}
            </div>

            {/* Title */}
            <div className="text-[16px] font-bold text-[var(--color-ink)] mb-[2px]">
              {selectedItem.title}
            </div>

            {/* Org */}
            <div
              className="text-[13px] font-medium"
              style={{
                color: dotColor,
                marginBottom: selectedItem.details ? 12 : 0,
              }}
            >
              {orgUrl ? (
                <a
                  href={orgUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'inherit', textDecoration: 'none' }}
                  className="hover:underline"
                >
                  {selectedItem.description} ↗
                </a>
              ) : (
                selectedItem.description
              )}
            </div>

            {/* Details */}
            {selectedItem.details && (
              <div className="text-[14px] leading-[1.75] text-[var(--color-ink-3)]">
                {selectedItem.details}
              </div>
            )}
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
