'use client';

import { useState } from 'react';
import HeroSection from '@/components/HeroSection';
import ResumeInput from '@/components/ResumeInput';
import ResultsSection from '@/components/ResultsSection';
import Footer from '@/components/Footer';
import type { ScoreResult } from '@/types';

export default function Home() {
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');

  const handleScoreCheck = async (text: string, jd: string) => {
    setResumeText(text);
    setJobDescription(jd);
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText: text, jobDescription: jd }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze resume. Please try again.');
      }

      setResult(data as ScoreResult);

      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-900 selection:text-white">
      <div className="relative z-10">
        <HeroSection />

        <section className="max-w-4xl mx-auto px-4 pb-16">
          <ResumeInput
            onSubmit={handleScoreCheck}
            isLoading={isLoading}
          />

          {error && (
            <div className="mt-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3 animate-fade-in-up">
              <svg className="w-5 h-5 mt-0.5 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}
        </section>

        {result && (
          <div id="results-section">
            <ResultsSection
              result={result}
              resumeText={resumeText}
              jobDescription={jobDescription}
              onReset={handleReset}
            />
          </div>
        )}

        <Footer />
      </div>
    </main>
  );
}
