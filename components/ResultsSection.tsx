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
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">
          Your ATS Analysis Results
        </h2>
        <p className="text-sm font-medium text-slate-500">
          {jobDescription
            ? 'Scored against your provided job description'
            : 'Scored against general ATS best practices'}
        </p>
      </div>

      {/* ─── Score hero card ─── */}
      <div className="clean-card p-8 sm:p-12 mb-8 text-center">
        <ScoreCircle score={result.score} />

        {/* Action buttons */}
        <div className="flex flex-wrap justify-center gap-3 mt-10">
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-sm font-bold transition-all duration-200"
          >
            {copied ? (
              <>
                <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-emerald-700">Copied to clipboard!</span>
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
            onClick={onReset}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-sm font-bold transition-all duration-200 shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Check another resume
          </button>
        </div>
      </div>

      {/* ─── Scoring breakdown bar ─── */}
      <div className="clean-card p-6 mb-8">
        <h3 className="text-sm font-bold text-slate-800 mb-5 flex items-center gap-2 uppercase tracking-wide">
          <svg className="w-4 h-4 text-[#1e3a8a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Scoring Categories
        </h3>
        <div className="space-y-4">
          {categories.map((cat) => (
            <div key={cat.name} className="flex items-center gap-4">
              <span className="text-sm font-semibold text-slate-700 w-44 shrink-0">{cat.name}</span>
              <div className="flex-1 h-2.5 bg-slate-100 border border-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#1e3a8a] rounded-full"
                  style={{
                    width: `${cat.weight}%`,
                    transition: 'width 1s cubic-bezier(0.34, 1.1, 0.64, 1)',
                  }}
                />
              </div>
              <span className="text-sm font-bold text-slate-500 w-10 text-right">{cat.weight}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Feedback grid ─── */}
      <div className="mb-4">
        <h3 className="text-xl font-extrabold text-slate-900 mb-6 flex items-center gap-2">
          <svg className="w-6 h-6 text-[#1e3a8a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          Detailed Feedback
          <span className="ml-auto text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
            {strengths.length} strength{strengths.length !== 1 ? 's' : ''} · {issues.length} issue{issues.length !== 1 ? 's' : ''} to fix
          </span>
        </h3>

        {/* Strengths */}
        {strengths.length > 0 && (
          <div className="mb-6">
            <h4 className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-1.5 h-4 rounded-full bg-emerald-500 inline-block" />
              Strengths
            </h4>
            <div className="grid sm:grid-cols-2 gap-4">
              {strengths.map((item, i) => (
                <FeedbackCard key={`s-${i}`} item={item} index={i} />
              ))}
            </div>
          </div>
        )}

        {/* Issues */}
        {issues.length > 0 && (
          <div>
            <h4 className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-1.5 h-4 rounded-full bg-amber-500 inline-block" />
              Issues to Fix
            </h4>
            <div className="grid sm:grid-cols-2 gap-4">
              {issues.map((item, i) => (
                <FeedbackCard key={`i-${i}`} item={item} index={i + strengths.length} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ─── CTA banner ─── */}
      <div className="mt-10 p-8 rounded-2xl bg-blue-50 border border-blue-100 text-center shadow-sm">
        <p className="text-sm font-bold text-blue-900 mb-5">
          Ready to find jobs that match your profile? Browse thousands of verified listings on WorkAtlas.
        </p>
        <a
          href="https://workatlas.tech"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#1e3a8a] hover:bg-blue-900 text-white text-sm font-bold rounded-xl transition-all duration-200 shadow-md hover:-translate-y-0.5"
        >
          Browse Jobs on WorkAtlas
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </section>
  );
}
