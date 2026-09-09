'use client';

import { useState } from 'react';
import ScoreCircle from '@/components/ScoreCircle';
import FeedbackCard from '@/components/FeedbackCard';
import type { ScoreResult } from '@/types';
import { getScoreColor } from '@/types';

interface ResultsSectionProps {
  result: ScoreResult;
  resumeText: string;
  jobDescription: string;
  onReset: () => void;
}

export default function ResultsSection({
  result,
  resumeText,
  jobDescription,
  onReset,
}: ResultsSectionProps) {
  const [copied, setCopied] = useState(false);

  const strengths = result.feedback.filter((f) => f.type === 'strength');
  const issues = result.feedback.filter((f) => f.type === 'issue');
  const colorKey = getScoreColor(result.score);

  // ─── Share score ──────────────────────────────────────────────────────────
  const handleShare = async () => {
    const label =
      colorKey === 'green' ? 'Excellent' :
      colorKey === 'yellow' ? 'Good' :
      colorKey === 'orange' ? 'Fair' : 'Poor';

    const text =
      `🎯 My ATS Resume Score: ${result.score}/100 (${label})\n` +
      `Check your resume at https://workatlas.tech/ats-checker — free, no sign-up!`;

    try {
      if (navigator.share) {
        await navigator.share({ text, url: 'https://workatlas.tech/ats-checker' });
      } else {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      // User cancelled share
    }
  };

  // ─── Category bar component ───────────────────────────────────────────────
  const categories = [
    { name: 'ATS Formatting', weight: 25 },
    { name: 'Keywords Match', weight: 30 },
    { name: 'Content Strength', weight: 20 },
    { name: 'Structure & Readability', weight: 15 },
    { name: 'Red Flags', weight: 10 },
  ];

  return (
    <section className="max-w-4xl mx-auto px-4 pb-24 animate-fade-in-up">
      {/* ─── Header ─── */}
      <div className="text-center mb-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Your ATS Analysis Results
        </h2>
        <p className="text-sm text-slate-400">
          {jobDescription
            ? 'Scored against your provided job description'
            : 'Scored against general ATS best practices'}
        </p>
      </div>

      {/* ─── Score hero card ─── */}
      <div className="glass-card p-8 sm:p-10 mb-6 text-center shadow-2xl shadow-black/50">
        <ScoreCircle score={result.score} />

        {/* Action buttons */}
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          <button
            id="share-score-btn"
            onClick={handleShare}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 text-sm font-medium transition-all duration-200 hover:border-indigo-500/50"
          >
            {copied ? (
              <>
                <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-emerald-400">Copied to clipboard!</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share my score
              </>
            )}
          </button>

          <button
            id="check-another-btn"
            onClick={onReset}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/8 border border-white/10 hover:border-white/20 text-slate-300 text-sm font-medium transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Check another resume
          </button>
        </div>
      </div>

      {/* ─── Scoring breakdown bar ─── */}
      <div className="glass-card p-6 mb-6">
        <h3 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
          <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Scoring Categories
        </h3>
        <div className="space-y-3">
          {categories.map((cat) => (
            <div key={cat.name} className="flex items-center gap-3">
              <span className="text-xs text-slate-400 w-40 shrink-0">{cat.name}</span>
              <div className="flex-1 h-1.5 bg-white/6 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full"
                  style={{
                    width: `${cat.weight}%`,
                    transition: 'width 1s cubic-bezier(0.34, 1.1, 0.64, 1)',
                  }}
                />
              </div>
              <span className="text-xs text-slate-500 w-8 text-right">{cat.weight}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Feedback grid ─── */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          Detailed Feedback
          <span className="ml-auto text-xs font-normal text-slate-500">
            {strengths.length} strength{strengths.length !== 1 ? 's' : ''} · {issues.length} issue{issues.length !== 1 ? 's' : ''} to fix
          </span>
        </h3>

        {/* Strengths */}
        {strengths.length > 0 && (
          <div className="mb-4">
            <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="w-1 h-4 rounded-full bg-emerald-500 inline-block" />
              Strengths
            </h4>
            <div className="grid sm:grid-cols-2 gap-3">
              {strengths.map((item, i) => (
                <FeedbackCard key={`s-${i}`} item={item} index={i} />
              ))}
            </div>
          </div>
        )}

        {/* Issues */}
        {issues.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="w-1 h-4 rounded-full bg-amber-500 inline-block" />
              Issues to Fix
            </h4>
            <div className="grid sm:grid-cols-2 gap-3">
              {issues.map((item, i) => (
                <FeedbackCard key={`i-${i}`} item={item} index={i + strengths.length} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ─── CTA banner ─── */}
      <div className="mt-6 p-6 rounded-2xl bg-gradient-to-r from-indigo-900/40 to-blue-900/40 border border-indigo-500/20 text-center">
        <p className="text-sm text-slate-300 mb-3">
          Ready to find jobs that match your profile? Browse thousands of verified listings on WorkAtlas.
        </p>
        <a
          href="https://workatlas.tech"
          target="_blank"
          rel="noopener noreferrer"
          id="workatlas-cta-btn"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-indigo-900/40"
        >
          Browse Jobs on WorkAtlas
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </section>
  );
}
