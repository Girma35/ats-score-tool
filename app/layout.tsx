import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Free ATS Resume Score Checker | WorkAtlas',
  description:
    'Check how well your resume passes Applicant Tracking Systems (ATS). Get an instant score, keyword analysis, and actionable feedback — free, no sign-up required.',
  keywords: [
    'ATS resume checker',
    'resume score',
    'applicant tracking system',
    'resume analyzer',
    'job application',
    'resume keywords',
    'WorkAtlas',
  ],
  authors: [{ name: 'WorkAtlas', url: 'https://workatlas.tech' }],
  metadataBase: new URL('https://workatlas.tech'),
  openGraph: {
    title: 'Free ATS Resume Score Checker | WorkAtlas',
    description:
      'Instantly check how well your resume passes ATS filters. Get a score out of 100 with detailed feedback.',
    url: 'https://workatlas.tech/ats-checker',
    siteName: 'WorkAtlas',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free ATS Resume Score Checker | WorkAtlas',
    description: 'Get your ATS resume score in seconds. Free, instant, no sign-up.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
