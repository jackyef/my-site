import { useRef, useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';

import { Chip } from '@/components/common/Chip';
import { PageHeader } from '@/components/common/PageHeader';
import { Text } from '@/components/common/Text';
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
const YEAR_PX = 200;

// Oldest first so bars flow left → right
const CHART_ITEMS = [...timelineEvents].reverse();
// Newest first for the list
const LIST_ITEMS = [...timelineEvents].map((item, i) => ({
  item,
  chartIndex: timelineEvents.length - 1 - i,
}));

function dateToYear(d: Date): number {
  return d.getFullYear() + d.getMonth() / 12;
}

function yearToPx(year: number): number {
  return (year - CHART_START) * YEAR_PX;
}

const TODAY_PX = yearToPx(dateToYear(TODAY));
const CHART_WIDTH = TODAY_PX + 40;

const YEAR_LABELS = Array.from(
  { length: Math.floor(dateToYear(TODAY)) - CHART_START + 1 },
  (_, i) => CHART_START + i,
);

function periodLabel(from: Date, to: Date, isCurrent: boolean): string {
  const fromStr = formatMonth(from, true, 'en-US', 'short') ?? '';
  const toStr = isCurrent
    ? 'Present'
    : (formatMonth(to, true, 'en-US', 'short') ?? '');
  const duration = getTimeDifference(from, isCurrent ? TODAY : to);
  return `${fromStr} – ${toStr} · ${duration}`;
}

// Matches motion.div transition duration (0.2s) + small buffer
const COLLAPSE_DURATION_MS = 220;
const EXPAND_DELAY_MS = 100;
const STICKY_OFFSET_PX = 44; // top-11 = 2.75rem
const SCROLL_GAP_PX = 8;

export function CareerView() {
  const [selected, setSelected] = useState<number>(CHART_ITEMS.length - 1);
  const [expanded, setExpanded] = useState<number>(CHART_ITEMS.length - 1);
  const stickyRef = useRef<HTMLDivElement>(null);
  const barRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const listItemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const mainContentRef = useRef<HTMLElement | null>(null);
  const pendingTimers = useRef<number[]>([]);

  // Cache the scroll container ref once
  useEffect(() => {
    mainContentRef.current = document.getElementById('main-content');
    return () => {
      pendingTimers.current.forEach(clearTimeout);
    };
  }, []);

  const selectAndScrollList = useCallback((i: number) => {
    // Clear any pending timers from a previous click
    pendingTimers.current.forEach(clearTimeout);
    pendingTimers.current = [];

    // 1. Highlight the bar + collapse previous details immediately
    setSelected(i);
    setExpanded(-1);

    // Horizontally center the bar in the chart
    const chart = stickyRef.current;
    const bar = barRefs.current[i];
    if (chart && bar) {
      chart.scrollTo({
        left: Math.max(0, bar.offsetLeft - chart.clientWidth / 2 + bar.offsetWidth / 2),
        behavior: 'smooth',
      });
    }

    // 2. Wait for collapse animation to finish, then scroll card into position
    const scrollTimer = window.setTimeout(() => {
      const el = listItemRefs.current[i];
      const sticky = stickyRef.current;
      const scrollContainer = mainContentRef.current;
      if (!el || !sticky || !scrollContainer) return;

      const containerTop = scrollContainer.getBoundingClientRect().top;
      const chartHeight = sticky.offsetHeight;
      const stuckBottom = containerTop + STICKY_OFFSET_PX + chartHeight;

      const elTop = el.getBoundingClientRect().top;
      const offset = elTop - stuckBottom - SCROLL_GAP_PX;

      if (Math.abs(offset) > 2) {
        scrollContainer.scrollBy({ top: offset, behavior: 'smooth' });
      }

      // 3. Expand the details after scroll has had time to start
      const expandTimer = window.setTimeout(() => {
        setExpanded(i);
      }, EXPAND_DELAY_MS);
      pendingTimers.current.push(expandTimer);
    }, COLLAPSE_DURATION_MS);
    pendingTimers.current.push(scrollTimer);
  }, []);

  const selectAndScrollChart = useCallback(
    (i: number) => {
      setSelected(i);
      setExpanded(i);
      const chart = stickyRef.current;
      const bar = barRefs.current[i];
      if (chart && bar) {
        chart.scrollTo({
          left: Math.max(0, bar.offsetLeft - chart.clientWidth / 2),
          behavior: 'smooth',
        });
      }
    },
    [],
  );

  // Initial scroll: center the Gantt on the selected bar once visible
  useEffect(() => {
    const chart = stickyRef.current;
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

      {/* Compact single-row Gantt swimlane — sticky below section tabs */}
      <div
        ref={stickyRef}
        className="sticky top-11 z-5 pt-2 pb-3 -mt-2"
        style={{
          overflowX: 'auto',
          background: 'var(--color-bg)',
          boxShadow: '0 4px 12px -4px rgba(0,0,0,0.08)',
        }}
      >
        <div style={{ paddingBottom: 4 }}>
          {/* Year axis labels */}
          <div style={{ marginBottom: 4 }}>
            <div
              style={{
                width: CHART_WIDTH,
                position: 'relative',
                height: 16,
              }}
            >
              {YEAR_LABELS.map((y) => (
                <div
                  key={y}
                  style={{
                    position: 'absolute',
                    left: yearToPx(y),
                    transform: 'translateX(-50%)',
                    fontSize: 10,
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

          {/* Single-row swimlane — all bars on one line */}
          <div
            style={{
              width: CHART_WIDTH,
              position: 'relative',
              height: 24,
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

            {/* All bars on the same row */}
            {CHART_ITEMS.map((item, i) => {
              const startPx = yearToPx(dateToYear(item.from));
              const endDate = item.to >= TODAY ? TODAY : item.to;
              const endPx = yearToPx(dateToYear(endDate));
              const widthPx = Math.max(endPx - startPx, 8);
              const isSelected = selected === i;
              const barColor =
                VARIANT_COLORS[item.variant] ?? 'var(--color-accent)';

              return (
                <button
                  key={i}
                  ref={(btn) => {
                    barRefs.current[i] = btn;
                  }}
                  id={`career-bar-${i}`}
                  aria-pressed={isSelected}
                  data-index={i}
                  onClick={() => selectAndScrollList(i)}
                  title={`${item.title} @ ${item.description}`}
                  style={{
                    position: 'absolute',
                    left: startPx,
                    width: widthPx,
                    top: 2,
                    bottom: 2,
                    borderRadius: 4,
                    zIndex: isSelected ? 2 : 1,
                    opacity: isSelected ? 1 : 0.35,
                    background: isSelected
                      ? barColor
                      : `color-mix(in srgb, ${barColor} 40%, var(--color-bg-hover))`,
                    border: `1.5px solid ${barColor}`,
                    boxShadow: isSelected
                      ? `0 0 0 2px var(--color-bg), 0 0 0 4px ${barColor}`
                      : 'none',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    transition:
                      'background 0.15s, box-shadow 0.15s, opacity 0.2s',
                    fontFamily: 'inherit',
                    padding: 0,
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>{/* end stickyRef */}

      {/* Stacked list of all career items — newest first */}
      <div className="flex flex-col gap-1 overflow-hidden" role="list">
        {LIST_ITEMS.map(({ item, chartIndex }) => {
          const isSelected = selected === chartIndex;
          const isExpanded = expanded === chartIndex;
          const isCurrent = item.to >= TODAY;
          const barColor =
            VARIANT_COLORS[item.variant] ?? 'var(--color-accent)';
          const orgUrl = ORG_URLS[item.description];
          const hasDetails = !!item.details;

          return (
            <div key={chartIndex} role="listitem">
              <button
                ref={(el) => {
                  listItemRefs.current[chartIndex] = el;
                }}
                onClick={() => selectAndScrollChart(chartIndex)}
                className="w-full text-left rounded-lg px-3 py-2.5 transition-colors cursor-pointer"
                style={{
                  background: isSelected
                    ? 'var(--color-bg-hover)'
                    : 'transparent',
                  borderLeft: isSelected
                    ? `3px solid ${barColor}`
                    : '3px solid transparent',
                }}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {/* Color dot */}
                  <span
                    className="shrink-0 rounded-full -translate-y-0.5"
                    style={{
                      width: 8,
                      height: 8,
                      background: barColor,
                    }}
                  />

                  {/* Title + company */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-x-2 gap-y-0.5 flex-wrap">
                      <span className="text-[14px] font-semibold text-(--color-ink)">
                        {item.title}
                      </span>
                      {orgUrl ? (
                        <a
                          href={orgUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[12px] font-medium hover:underline"
                          style={{ color: barColor }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {item.description} ↗
                        </a>
                      ) : (
                        <span className="text-[12px] text-(--color-ink-3)">
                          {item.description}
                        </span>
                      )}
                      {isCurrent && (
                        <Chip variant="highlight" size="xs">
                          Current
                        </Chip>
                      )}
                    </div>
                  </div>

                  {/* Expand chevron */}
                  {hasDetails && (
                    <ChevronDown
                      size={14}
                      className="shrink-0 transition-transform duration-200"
                      style={{
                        color: 'var(--color-ink-4)',
                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                      }}
                    />
                  )}
                </div>

                {/* Period — below the title */}
                <div className="mt-0.5 ml-4.5">
                  <Text variant="caption-sm">
                    {periodLabel(item.from, item.to, isCurrent)}
                  </Text>
                </div>
              </button>

              {/* Expanded details — inline with continued left border */}
              <AnimatePresence>
                {isExpanded && item.details && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div
                      className="ml-3 pl-5 mr-3 pb-3"
                      style={{
                        borderLeft: `2px solid ${barColor}`,
                      }}
                    >
                      <div className="text-[14px] leading-[1.75] text-(--color-ink-3)">
                        {item.details}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
