import { animate } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';

import { ChessComTimeControl } from 'types/chesscom';
import { ChessComTimeControlIcon } from '@/components/ChessComStats/ChessComTimeCategoryIcon';
import { useMatchesSummary } from '@/components/ChessComStats/hooks/useMatchesSummary';
import { useStats } from '@/components/ChessComStats/hooks/useStats';

interface ChipProps {
  children: React.ReactNode;
  highlight?: boolean;
}

function Chip({ children, highlight }: ChipProps) {
  return (
    <span
      style={{
        fontSize: 12,
        fontWeight: 500,
        padding: '3px 9px',
        borderRadius: 100,
        background: highlight ? 'var(--color-accent-xl)' : 'var(--color-bg)',
        color: highlight ? 'var(--color-accent-text)' : 'var(--color-ink-2)',
        border: `1px solid ${
          highlight ? 'var(--color-accent-l)' : 'var(--color-border)'
        }`,
        lineHeight: 1,
        display: 'inline-block',
      }}
    >
      {children}
    </span>
  );
}

interface WidgetProps {
  label: string;
  children: React.ReactNode;
  span?: 1 | 2 | 3;
  mobileFullWidth?: boolean;
}

function Widget({ label, children, span = 1, mobileFullWidth }: WidgetProps) {
  const classNames = [
    'widget-card',
    span === 3 ? 'widget-full' : '',
    mobileFullWidth ? 'widget-mobile-full' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={classNames}
      style={{
        gridColumn: span !== 3 && !mobileFullWidth ? `span ${span}` : undefined,
        padding: '14px 16px',
        borderRadius: 10,
        background: 'var(--color-bg-panel)',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-sm)',
        transition:
          'transform 0.2s, box-shadow 0.2s, background-color 0.22s, border-color 0.22s',
        cursor: 'default',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform =
          'translateY(-1px)';
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          'var(--shadow-md)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = '';
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          'var(--shadow-sm)';
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--color-ink-4)',
          marginBottom: 8,
        }}
      >
        {label}
      </div>
      {children}
    </div>
  );
}

function WidgetValue({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontFamily: 'var(--font-serif)',
        fontSize: 20,
        fontWeight: 600,
        color: 'var(--color-ink)',
        lineHeight: 1.2,
        marginBottom: 3,
      }}
    >
      {children}
    </div>
  );
}

function WidgetSub({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div style={{ fontSize: 13, color: 'var(--color-ink-3)', ...style }}>
      {children}
    </div>
  );
}

const CHESS_USER_ID = '344047395';
const CHESS_USERNAME = 'PixelParser';
const TIME_CONTROLS: ChessComTimeControl[] = ['rapid', 'blitz', 'bullet'];

function WLD({
  w,
  d,
  l,
  label,
}: {
  w: number;
  d: number;
  l: number;
  label: string;
}) {
  return (
    <div style={{ marginBottom: 6 }}>
      <div
        style={{
          fontSize: 11,
          color: 'var(--color-ink-4)',
          marginBottom: 3,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
        }}
      >
        {label}
      </div>
      <div
        style={{
          display: 'flex',
          gap: 10,
          fontSize: 13,
          fontWeight: 600,
        }}
      >
        <span style={{ color: '#4caf84' }}>W {w}</span>
        <span style={{ color: 'var(--color-ink-3)' }}>D {d}</span>
        <span style={{ color: '#e05a5a' }}>L {l}</span>
      </div>
    </div>
  );
}

function ChessWidget() {
  const [tc, setTc] = useState<ChessComTimeControl>('rapid');
  const ratingRef = useRef<HTMLSpanElement>(null);

  const { stats, matches } = useStats({
    userId: CHESS_USER_ID,
    timeControl: tc,
  });
  const matchesSummary = useMatchesSummary({
    matches,
    username: CHESS_USERNAME,
  });

  useEffect(() => {
    if (!stats || !ratingRef.current) return;
    const node = ratingRef.current;
    const controls = animate(0, stats.rating_last, {
      duration: 1,
      ease: [0.25, 0.1, 0.25, 1],
      onUpdate: (v) => {
        node.textContent = String(Math.round(v));
      },
    });
    return () => controls.stop();
  }, [stats?.rating_last, tc]);

  const allTimeWins = stats ? stats.white_win_count + stats.black_win_count : 0;
  const allTimeDraws = stats
    ? stats.white_draw_count + stats.black_draw_count
    : 0;
  const allTimeLosses = stats
    ? stats.white_loss_count + stats.black_loss_count
    : 0;

  const streakEmoji =
    matchesSummary?.lastResult === 'wins'
      ? '🔥'
      : matchesSummary?.lastResult === 'losses'
      ? '🥶'
      : '↔️';
  const streakEmojis = matchesSummary
    ? Array.from({
        length: Math.min(Math.ceil(matchesSummary.streakCount / 3), 3),
      })
        .fill(streakEmoji)
        .join('')
    : '';

  return (
    <Widget label="Chess.com" span={3}>
      <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
        {/* Left: identity + time picker + rating */}
        <div style={{ minWidth: 140 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 12,
            }}
          >
            <a
              href="https://chess.com/member/pixelparser"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: 'var(--color-accent-text)',
                fontFamily: 'var(--font-serif)',
                fontSize: 15,
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              PixelParser ↗
            </a>
            {/* Time control picker */}
            <div
              style={{
                display: 'flex',
                borderRadius: 8,
                border: '1px solid var(--color-border)',
                overflow: 'hidden',
              }}
            >
              {TIME_CONTROLS.map((control) => (
                <button
                  key={control}
                  onClick={() => setTc(control)}
                  title={control}
                  aria-label={`Switch to ${control}`}
                  aria-pressed={tc === control}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '5px 9px',
                    background:
                      tc === control ? 'var(--color-bg-active)' : 'transparent',
                    color:
                      tc === control
                        ? 'var(--color-accent-text)'
                        : 'var(--color-ink-4)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background 0.13s, color 0.13s',
                    fontFamily: 'inherit',
                  }}
                >
                  <ChessComTimeControlIcon timeControl={control} />
                </button>
              ))}
            </div>
          </div>

          {/* Animated rating */}
          <div
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 36,
              fontWeight: 700,
              color: 'var(--color-ink)',
              lineHeight: 1,
              marginBottom: 2,
            }}
          >
            <span ref={ratingRef}>—</span>
          </div>
          <WidgetSub>
            {tc} rating
            {stats ? ` · ${stats.rating_max} peak` : ''}
          </WidgetSub>
        </div>

        {/* Right: records + streak */}
        {stats && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <WLD
              label="All-time"
              w={allTimeWins}
              d={allTimeDraws}
              l={allTimeLosses}
            />
            {matchesSummary && (
              <WLD
                label={`Last ${matchesSummary.totalMatches}`}
                w={matchesSummary.wins}
                d={matchesSummary.draws}
                l={matchesSummary.losses}
              />
            )}
            {matchesSummary && (
              <WidgetSub style={{ marginTop: 4 }}>
                {matchesSummary.streakCount} {matchesSummary.lastResult} in a
                row {streakEmojis}
              </WidgetSub>
            )}
          </div>
        )}
      </div>
    </Widget>
  );
}

export function WidgetGrid() {
  return (
    <div className="widget-grid">
      {/* Currently */}
      <Widget label="Currently" span={2}>
        <WidgetValue>Tech Lead at Sticker Mule</WidgetValue>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginTop: 6,
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: '#4caf84',
              animation: 'pulse 2.5s ease-in-out infinite',
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: 14,
              color: 'var(--color-ink-2)',
              fontWeight: 500,
            }}
          >
            Open to interesting remote opportunities
          </span>
        </div>
      </Widget>

      {/* Based in */}
      <Widget label="Based in" mobileFullWidth>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginTop: 4,
          }}
        >
          <span style={{ fontSize: 28 }}>🇮🇩</span>
          <div>
            <WidgetValue>
              <span style={{ fontSize: 17 }}>Jakarta</span>
            </WidgetValue>
            <WidgetSub>Indonesia · UTC+7</WidgetSub>
          </div>
        </div>
      </Widget>

      {/* Day-to-day stack */}
      <Widget label="Day-to-day stack" span={3}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 5,
            marginTop: 8,
          }}
        >
          {[
            { name: 'React', hi: true },
            { name: 'TypeScript', hi: true },
            { name: 'Next.js', hi: true },
            { name: 'Node.js', hi: false },
            { name: 'GraphQL', hi: false },
            { name: 'Apollo', hi: false },
            { name: 'Docker', hi: false },
            { name: 'WebAssembly', hi: false },
            { name: 'Rust', hi: false },
            { name: 'Web Perf', hi: true },
            { name: 'Frontend Infra', hi: true },
          ].map(({ name, hi }) => (
            <Chip key={name} highlight={hi}>
              {name}
            </Chip>
          ))}
        </div>
      </Widget>

      {/* Experience */}
      <Widget label="Experience">
        <WidgetValue>7+ years</WidgetValue>
        <WidgetSub>Tokopedia → Sticker Mule</WidgetSub>
      </Widget>

      {/* Talks given */}
      <Widget label="Talks given">
        <WidgetValue>5+</WidgetValue>
        <WidgetSub>Conferences & meetups</WidgetSub>
      </Widget>

      {/* Chess.com */}
      <ChessWidget />
    </div>
  );
}
