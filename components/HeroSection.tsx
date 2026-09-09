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
          className="group flex items-center gap-2.5 px-4 py-2 rounded-full glass-card hover:border-indigo-500/40 transition-all duration-300"
        >
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
            WorkAtlas
          </span>
          <svg className="w-3 h-3 text-slate-500 group-hover:text-slate-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </Link>
      </div>

      {/* Badge */}
      <div className="flex justify-center mb-5">
        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 animate-fade-in">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Free • No sign-up required • Instant results
        </span>
      </div>

      {/* Main heading */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
        Free ATS{' '}
        <span className="text-gradient">Resume Score</span>
        <br />Checker
      </h1>

      {/* Subtitle */}
      <p className="max-w-xl mx-auto text-base sm:text-lg text-slate-400 leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
        Find out if your resume passes Applicant Tracking System filters.
        Get an instant score out of 100 with specific, actionable feedback.
      </p>

      {/* Stats row */}
      <div className="flex flex-wrap justify-center gap-6 mt-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
        {[
          { value: '5', label: 'scoring categories' },
          { value: '100', label: 'point scale' },
          { value: '<30s', label: 'analysis time' },
        ].map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-10 h-10 rounded-full glass-card flex items-center justify-center animate-fade-in" style={{ animationDelay: '0.5s' }}>
        <svg className="w-4 h-4 text-slate-400 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </header>
  );
}
