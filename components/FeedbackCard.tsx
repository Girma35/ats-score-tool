'use client';

import type { FeedbackItem } from '@/types';

interface FeedbackCardProps {
  item: FeedbackItem;
  index: number;
}

const STRENGTH_STYLE = {
  icon: (
    <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  iconBg: 'bg-emerald-500/10 border border-emerald-500/20',
  titleColor: 'text-emerald-300',
  cardBorder: 'border-emerald-500/15',
  label: 'Strength',
  labelStyle: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
};

const ISSUE_STYLE = {
  icon: (
    <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.834-1.964-.834-2.732 0L3.06 16.5C2.29 18.333 3.252 20 4.792 20z" />
    </svg>
  ),
  iconBg: 'bg-amber-500/10 border border-amber-500/20',
  titleColor: 'text-amber-300',
  cardBorder: 'border-amber-500/15',
  label: 'Issue to Fix',
  labelStyle: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
};

export default function FeedbackCard({ item, index }: FeedbackCardProps) {
  const style = item.type === 'strength' ? STRENGTH_STYLE : ISSUE_STYLE;
  const animClass = `animate-card-${Math.min(index + 1, 6)}`;

  return (
    <div
      className={`glass-card glass-card-hover p-4 sm:p-5 border ${style.cardBorder} ${animClass}`}
    >
      <div className="flex items-start gap-3.5">
        {/* Icon */}
        <div className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${style.iconBg}`}>
          {style.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${style.labelStyle}`}>
              {style.label}
            </span>
          </div>
          <h3 className={`text-sm font-semibold ${style.titleColor} leading-snug`}>
            {item.title}
          </h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">{item.description}</p>
        </div>
      </div>
    </div>
  );
}
