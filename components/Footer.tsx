'use client';

import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/6 mt-8 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Top row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <Link
            href="https://workatlas.tech"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 group"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-900/40">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <span className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">
                WorkAtlas
              </span>
              <span className="block text-[10px] text-slate-500">workatlas.tech</span>
            </div>
          </Link>

          {/* Links */}
          <nav className="flex items-center gap-5 text-sm text-slate-400">
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
                className="hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/8 to-transparent mb-6" />

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <p>
            © {currentYear} WorkAtlas · ATS Resume Score Checker · Free tool, no data stored
          </p>
          <p className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Powered by WorkAtlas · AI-driven resume analysis
          </p>
        </div>

        {/* Disclaimer */}
        <p className="text-center text-[11px] text-slate-700 mt-4 max-w-lg mx-auto leading-relaxed">
          This tool provides automated ATS compatibility analysis. Results are estimates and may vary across different ATS platforms. Always tailor your resume for each specific role.
        </p>
      </div>
    </footer>
  );
}
