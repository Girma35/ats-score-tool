'use client';

import { useEffect, useState } from 'react';
import { getScoreColor, getScoreLabel, getScoreSubtext } from '@/types';

interface ScoreCircleProps {
  score: number;
}

const COLOR_MAP = {
  green:  { stroke: '#22c55e', glow: 'rgba(34,197,94,0.35)',  text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/25' },
  yellow: { stroke: '#eab308', glow: 'rgba(234,179,8,0.35)',  text: 'text-yellow-400',  bg: 'bg-yellow-500/10',  border: 'border-yellow-500/25'  },
  orange: { stroke: '#f97316', glow: 'rgba(249,115,22,0.35)', text: 'text-orange-400',  bg: 'bg-orange-500/10',  border: 'border-orange-500/25'  },
  red:    { stroke: '#ef4444', glow: 'rgba(239,68,68,0.35)',  text: 'text-red-400',     bg: 'bg-red-500/10',     border: 'border-red-500/25'     },
};

const RADIUS = 90;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS; // ≈ 565.5

export default function ScoreCircle({ score }: ScoreCircleProps) {
  const [displayed, setDisplayed] = useState(0);
  const [animated, setAnimated] = useState(false);

  const colorKey = getScoreColor(score);
  const colors = COLOR_MAP[colorKey];
  const label = getScoreLabel(score);
  const subtext = getScoreSubtext(score);

  // Count-up animation
  useEffect(() => {
    setDisplayed(0);
    setAnimated(false);

    const duration = 1400;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out-cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(eased * score));
      if (progress < 1) requestAnimationFrame(tick);
      else setAnimated(true);
    };

    requestAnimationFrame(tick);
  }, [score]);

  const dashOffset = CIRCUMFERENCE * (1 - score / 100);

  return (
    <div className="flex flex-col items-center">
      {/* Circle */}
      <div className="relative w-52 h-52 sm:w-60 sm:h-60">
        {/* Glow rings */}
        {animated && (
          <>
            <div
              className="absolute inset-0 rounded-full animate-pulse-ring"
              style={{ background: `radial-gradient(circle, ${colors.glow} 0%, transparent 70%)` }}
            />
            <div
              className="absolute inset-4 rounded-full animate-pulse-ring"
              style={{ background: `radial-gradient(circle, ${colors.glow} 0%, transparent 70%)`, animationDelay: '0.5s' }}
            />
          </>
        )}

        <svg
          className="w-full h-full -rotate-90"
          viewBox="0 0 200 200"
          fill="none"
        >
          {/* Background track */}
          <circle
            cx="100"
            cy="100"
            r={RADIUS}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="12"
          />

          {/* Colored progress arc */}
          <circle
            cx="100"
            cy="100"
            r={RADIUS}
            stroke={colors.stroke}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            style={{
              transition: 'stroke-dashoffset 1.4s cubic-bezier(0.34, 1.1, 0.64, 1)',
              filter: `drop-shadow(0 0 8px ${colors.stroke}80)`,
            }}
          />

          {/* Tick marks */}
          {[0, 40, 60, 80].map((val) => {
            const angle = (val / 100) * 360 - 90;
            const rad = (angle * Math.PI) / 180;
            const x1 = 100 + (RADIUS - 8) * Math.cos(rad);
            const y1 = 100 + (RADIUS - 8) * Math.sin(rad);
            const x2 = 100 + (RADIUS + 2) * Math.cos(rad);
            const y2 = 100 + (RADIUS + 2) * Math.sin(rad);
            return (
              <line
                key={val}
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="2"
                strokeLinecap="round"
              />
            );
          })}
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center animate-score-pop">
          <span
            className={`text-5xl sm:text-6xl font-black tabular-nums ${colors.text}`}
            style={{ textShadow: `0 0 30px ${colors.stroke}60` }}
          >
            {displayed}
          </span>
          <span className="text-xs text-slate-500 font-medium tracking-wider uppercase mt-0.5">
            out of 100
          </span>
        </div>
      </div>

      {/* Label badge */}
      <div className={`mt-5 flex flex-col items-center gap-2`}>
        <span
          className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold border ${colors.bg} ${colors.border} ${colors.text}`}
        >
          <span className="w-2 h-2 rounded-full" style={{ background: colors.stroke }} />
          {label}
        </span>
        <p className="text-sm text-slate-400 text-center max-w-xs">{subtext}</p>
      </div>
    </div>
  );
}
