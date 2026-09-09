'use client';

import Link from 'next/link';

export default function HeroSection() {
  return (
    <header className="relative pt-16 pb-12 px-4 text-center">
      {/* Logo / Brand */}
      <div className="flex justify-center mb-8">
        <Link
          href="https://workatlas.tech"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2.5 px-4 py-2 rounded-full border border-slate-200 bg-white hover:border-[#1e3a8a]/30 transition-all duration-300 shadow-sm"
        >
          <div className="w-6 h-6 rounded-md bg-[#1e3a8a] flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="text-sm font-bold text-slate-700 group-hover:text-[#1e3a8a] transition-colors">
            WorkAtlas
          </span>
        </Link>
      </div>

      {/* Badge */}
      <div className="flex justify-center mb-5">
        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-50 border border-blue-100 text-blue-700 animate-fade-in-up">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Free • No sign-up required • Instant results
        </span>
      </div>

      {/* Main heading */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        Free ATS <span className="text-[#1e3a8a]">Resume Score</span>
        <br />Checker
      </h1>

      {/* Subtitle */}
      <p className="max-w-xl mx-auto text-base sm:text-lg text-slate-600 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        Find out if your resume passes Applicant Tracking System filters.
        Get an instant score out of 100 with specific, actionable feedback.
      </p>
    </header>
  );
}
