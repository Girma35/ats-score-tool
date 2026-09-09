'use client';

import { useEffect, useState } from 'react';
import { getScoreColor, getScoreLabel, getScoreSubtext } from '@/types';

interface ScoreCircleProps {
  score: number;
}

const COLOR_MAP = {
  green:  { stroke: '#10b981', text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  yellow: { stroke: '#f59e0b', text: 'text-amber-600',  bg: 'bg-amber-50',  border: 'border-amber-200'  },
  orange: { stroke: '#ea580c', text: 'text-orange-600',  bg: 'bg-orange-50',  border: 'border-orange-200'  },
  red:    { stroke: '#ef4444', text: 'text-red-600',     bg: 'bg-red-50',     border: 'border-red-200'     },
};

const RADIUS = 90;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function ScoreCircle({ score }: ScoreCircleProps) {
  const [displayed, setDisplayed] = useState(0);
  const [animated, setAnimated] = useState(false);

  const colorKey = getScoreColor(score);
  const colors = COLOR_MAP[colorKey];
  const label = getScoreLabel(score);
  const subtext = getScoreSubtext(score);

  useEffect(() => {
    setDisplayed(0);
    setAnimated(false);

    const duration = 1400;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
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
            stroke="#e2e8f0"
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
                stroke="#cbd5e1"
                strokeWidth="3"
                strokeLinecap="round"
              />
            );
          })}
        </svg>

        {/* Center content */}
        <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 ${animated ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
          <span className="text-5xl sm:text-6xl font-black tabular-nums text-black tracking-tight">
            {displayed}
          </span>
          <span className="text-xs text-gray-900 font-black tracking-wider uppercase mt-1">
            out of 100
          </span>
        </div>
      </div>

      {/* Label badge */}
      <div className="mt-6 flex flex-col items-center gap-2.5">
        <span
          className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold border shadow-sm ${colors.bg} ${colors.border} ${colors.text}`}
        >
          <span className="w-2 h-2 rounded-full" style={{ background: colors.stroke }} />
          {label}
        </span>
        <p className="text-sm text-gray-900 font-bold text-center max-w-xs">{subtext}</p>
      </div>
    </div>
  );
}
