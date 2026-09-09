'use client';

import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 mt-12 py-10 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Top row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <Link
            href="https://workatlas.tech"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 group"
          >
            <div className="w-7 h-7 rounded-lg bg-[#1e3a8a] flex items-center justify-center shadow-sm">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <span className="text-sm font-extrabold text-slate-800 group-hover:text-[#1e3a8a] transition-colors">
                WorkAtlas
              </span>
              <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
                workatlas.tech
              </span>
            </div>
          </Link>

          {/* Links */}
          <nav className="flex items-center gap-6 text-sm font-semibold text-slate-500">
            {[
              { label: 'Job Board', href: 'https://workatlas.tech' },
              { label: 'Privacy', href: 'https://workatlas.tech/privacy' },
              { label: 'Contact', href: 'https://workatlas.tech/contact' },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#1e3a8a] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-200 mb-6" />

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-semibold text-slate-500">
          <p>
            © {currentYear} WorkAtlas · ATS Resume Score Checker
          </p>
          <p className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            AI-driven resume analysis
          </p>
        </div>

        {/* Disclaimer */}
        <p className="text-center text-[11px] font-medium text-slate-400 mt-6 max-w-xl mx-auto leading-relaxed">
          This tool provides automated ATS compatibility analysis. Results are estimates and may vary across different ATS platforms. Always tailor your resume for each specific role.
        </p>
      </div>
    </footer>
  );
}
