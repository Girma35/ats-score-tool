'use client';

import type { FeedbackItem } from '@/types';

interface FeedbackCardProps {
  item: FeedbackItem;
  index: number;
}

const STRENGTH_STYLE = {
  icon: (
    <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  ),
  iconBg: 'bg-emerald-100 border border-emerald-200',
  titleColor: 'text-slate-800',
  cardBorder: 'border-emerald-200',
  label: 'Strength',
  labelStyle: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
};

const ISSUE_STYLE = {
  icon: (
    <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.834-1.964-.834-2.732 0L3.06 16.5C2.29 18.333 3.252 20 4.792 20z" />
    </svg>
  ),
  iconBg: 'bg-amber-100 border border-amber-200',
  titleColor: 'text-slate-800',
  cardBorder: 'border-amber-200',
  label: 'Issue to Fix',
  labelStyle: 'bg-amber-50 text-amber-700 border border-amber-200',
};

export default function FeedbackCard({ item, index }: FeedbackCardProps) {
  const style = item.type === 'strength' ? STRENGTH_STYLE : ISSUE_STYLE;
  const animClass = `animate-card-${Math.min(index + 1, 6)}`;

  return (
    <div
      className={`clean-card clean-card-hover p-4 sm:p-5 border ${style.cardBorder} ${animClass}`}
    >
      <div className="flex items-start gap-3.5">
        {/* Icon */}
        <div className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${style.iconBg}`}>
          {style.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <span className={`text-[11px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-md ${style.labelStyle}`}>
              {style.label}
            </span>
          </div>
          <h3 className={`text-sm font-bold ${style.titleColor} leading-snug`}>
            {item.title}
          </h3>
          <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">{item.description}</p>
        </div>
      </div>
    </div>
  );
}
