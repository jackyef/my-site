import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

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
const CHART_END = 2027;
// Every 2 years to avoid crowding on the 14-year span
const YEAR_LABELS = [2013, 2015, 2017, 2019, 2021, 2023, 2025];

// Oldest first so bars flow left → right
const CHART_ITEMS = [...timelineEvents].reverse();

function dateToYear(d: Date): number {
  return d.getFullYear() + d.getMonth() / 12;
}

function toPercent(year: number): number {
  return ((year - CHART_START) / (CHART_END - CHART_START)) * 100;
}

function shortOrg(description: string): string {
  const known: Record<string, string> = {
    'Sticker Mule': 'Sticker Mule',
    Tokopedia: 'Tokopedia',
    Unemployed: 'Unemployed',
  };
  return known[description] ?? description.split(',')[0].slice(0, 10);
}

function periodLabel(from: Date, to: Date, isCurrent: boolean): string {
  const fromStr = formatMonth(from, true, 'en-US', 'short') ?? '';
  const toStr = isCurrent
    ? 'Present'
    : formatMonth(to, true, 'en-US', 'short') ?? '';
  const duration = getTimeDifference(from, isCurrent ? TODAY : to);
  return `${fromStr} – ${toStr} · ${duration}`;
}

export function CareerView() {
  // Default to the most recent (current) role
  const [selected, setSelected] = useState<number>(CHART_ITEMS.length - 1);

  const selectedItem = CHART_ITEMS[selected];
  const isCurrent = selectedItem.to >= TODAY;
  const dotColor =
    VARIANT_COLORS[selectedItem.variant] ?? 'var(--color-accent)';
  const orgUrl = ORG_URLS[selectedItem.description];

  return (
    <div className="page-pad">
      <p className="eyebrow" style={{ marginBottom: 10 }}>
        Career
      </p>
      <h1 className="page-title" style={{ marginBottom: 32 }}>
        Work <em>history.</em>
      </h1>

      {/* Gantt Chart */}
      <div style={{ overflowX: 'auto', marginBottom: 20 }}>
        <div style={{ minWidth: 600, paddingBottom: 4 }}>
          {/* Year axis labels */}
          <div style={{ display: 'flex', paddingLeft: 92, marginBottom: 6 }}>
            <div style={{ flex: 1, position: 'relative', height: 18 }}>
              {YEAR_LABELS.map((y) => (
                <div
                  key={y}
                  style={{
                    position: 'absolute',
                    left: `${toPercent(y)}%`,
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
              const start = dateToYear(item.from);
              const rawEnd = item.to >= TODAY ? TODAY : item.to;
              const end = dateToYear(rawEnd);
              const left = toPercent(start);
              const width = Math.max(toPercent(end) - left, 1.5);
              const isSelected = selected === i;
              const barColor =
                VARIANT_COLORS[item.variant] ?? 'var(--color-accent)';

              return (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    height: 32,
                  }}
                >
                  {/* Org label */}
                  <div
                    style={{
                      width: 84,
                      flexShrink: 0,
                      fontSize: 10,
                      fontWeight: 600,
                      color: 'var(--color-ink-4)',
                      textAlign: 'right',
                      letterSpacing: '0.04em',
                      lineHeight: 1.25,
                      textTransform: 'uppercase',
                      wordBreak: 'break-word',
                    }}
                  >
                    {shortOrg(item.description)}
                  </div>

                  {/* Bar area with year grid lines */}
                  <div
                    style={{ flex: 1, position: 'relative', height: '100%' }}
                  >
                    {YEAR_LABELS.map((y) => (
                      <div
                        key={y}
                        style={{
                          position: 'absolute',
                          left: `${toPercent(y)}%`,
                          top: 0,
                          bottom: 0,
                          width: 1,
                          background: 'var(--color-border)',
                        }}
                      />
                    ))}

                    <button
                      onClick={() => setSelected(i)}
                      title={`${item.title} @ ${shortOrg(item.description)}`}
                      style={{
                        position: 'absolute',
                        left: `${left}%`,
                        width: `${width}%`,
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
          style={{
            padding: '16px 20px',
            background: 'var(--color-bg-panel)',
            border: '1px solid var(--color-border)',
            borderRadius: 10,
            maxHeight: 420,
            overflowY: 'auto',
          }}
        >
          {/* Period + current badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 4,
            }}
          >
            <span style={{ fontSize: 12, color: 'var(--color-ink-4)' }}>
              {periodLabel(selectedItem.from, selectedItem.to, isCurrent)}
            </span>
            {isCurrent && (
              <span
                style={{
                  fontSize: 10,
                  padding: '1px 6px',
                  borderRadius: 100,
                  background: 'var(--color-accent-xl)',
                  color: 'var(--color-accent-text)',
                  border: '1px solid var(--color-accent-l)',
                  fontWeight: 600,
                }}
              >
                Current
              </span>
            )}
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: 'var(--color-ink)',
              marginBottom: 2,
            }}
          >
            {selectedItem.title}
          </div>

          {/* Org */}
          <div
            style={{
              fontSize: 13,
              color: dotColor,
              fontWeight: 500,
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
            <div
              style={{
                fontSize: 14,
                lineHeight: 1.75,
                color: 'var(--color-ink-3)',
              }}
            >
              {selectedItem.details}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
