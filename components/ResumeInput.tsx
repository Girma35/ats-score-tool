'use client';

import { useState, useRef, useCallback } from 'react';

interface ResumeInputProps {
  onSubmit: (resumeText: string, jobDescription: string) => void;
  isLoading: boolean;
}

type Tab = 'upload' | 'paste';

export default function ResumeInput({ onSubmit, isLoading }: ResumeInputProps) {
  const [activeTab, setActiveTab] = useState<Tab>('paste');
  const [pastedText, setPastedText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parsedFileText, setParsedFileText] = useState('');
  const [showJD, setShowJD] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ─── File parsing ──────────────────────────────────────────────────────────
  const parseFile = useCallback(async (file: File) => {
    setParseError(null);
    setIsParsing(true);
    setParsedFileText('');

    const ext = file.name.split('.').pop()?.toLowerCase();

    try {
      if (ext === 'pdf') {
        const pdfjsLib = await import('pdfjs-dist');
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let text = '';

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const pageText = content.items
            .map((item) => ('str' in item ? item.str : ''))
            .join(' ');
          text += pageText + '\n';
        }

        if (!text.trim()) {
          throw new Error('Could not extract text from this PDF. It may be image-based — please paste your resume text instead.');
        }

        setParsedFileText(text.trim());
      } else if (ext === 'docx') {
        const mammoth = await import('mammoth');
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        if (!result.value.trim()) {
          throw new Error('Could not extract text from this DOCX file.');
        }
        setParsedFileText(result.value.trim());
      } else {
        throw new Error('Unsupported file type. Please upload a PDF or DOCX file.');
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to parse file.';
      setParseError(msg);
      setUploadedFile(null);
      setParsedFileText('');
    } finally {
      setIsParsing(false);
    }
  }, []);

  const handleFileSelect = useCallback(
    async (file: File) => {
      const maxSize = 10 * 1024 * 1024; // 10 MB
      if (file.size > maxSize) {
        setParseError('File is too large. Maximum size is 10 MB.');
        return;
      }
      setUploadedFile(file);
      await parseFile(file);
    },
    [parseFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFileSelect(file);
    },
    [handleFileSelect]
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  // ─── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = () => {
    const text = activeTab === 'paste' ? pastedText : parsedFileText;
    onSubmit(text.trim(), jobDescription.trim());
  };

  const canSubmit = () => {
    if (isLoading || isParsing) return false;
    if (activeTab === 'paste') return pastedText.trim().length >= 50;
    return parsedFileText.trim().length >= 50;
  };

  const charCount = activeTab === 'paste' ? pastedText.length : parsedFileText.length;

  return (
    <div className="mt-8 space-y-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
      {/* ─── Main card ─── */}
      <div className="clean-card p-6 sm:p-8">
        {/* Tab bar */}
        <div className="flex gap-1 p-1 bg-slate-100 rounded-xl mb-6 border border-slate-200">
          {(['paste', 'upload'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setParseError(null);
              }}
              className={`
                flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-200
                ${activeTab === tab
                  ? 'bg-white text-[#1e3a8a] shadow-sm border border-slate-200'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                }
              `}
            >
              {tab === 'paste' ? (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Paste Resume
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Upload File
                </>
              )}
            </button>
          ))}
        </div>

        {/* ─── Paste tab ─── */}
        {activeTab === 'paste' && (
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Paste your resume text
            </label>
            <div className="relative">
              <textarea
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="Paste the full text of your resume here...&#10;&#10;Tip: Copy everything from your resume document — contact info, experience, skills, education — and paste it all here."
                rows={10}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 resize-none transition-all duration-200 focus:bg-white"
              />
              <div className="absolute bottom-3 right-3 text-xs text-slate-500 font-medium bg-white/80 px-2 py-1 rounded backdrop-blur-sm">
                {charCount.toLocaleString()} chars
              </div>
            </div>
            {pastedText.length > 0 && pastedText.length < 50 && (
              <p className="text-xs text-amber-600 flex items-center gap-1.5 font-medium mt-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.834-1.964-.834-2.732 0L3.06 16.5C2.29 18.333 3.252 20 4.792 20z" />
                </svg>
                Please paste more text (minimum 50 characters)
              </p>
            )}
          </div>
        )}

        {/* ─── Upload tab ─── */}
        {activeTab === 'upload' && (
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-slate-700">
              Upload your resume
            </label>

            <div
              className={`drop-zone rounded-xl p-8 text-center cursor-pointer ${isDragOver ? 'drag-over' : ''}`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelect(file);
                }}
              />

              {isParsing ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-10 h-10 border-2 border-slate-200 border-t-[#1e3a8a] rounded-full animate-spin-slow" />
                  <p className="text-sm text-slate-500 font-medium">Extracting text from file...</p>
                </div>
              ) : uploadedFile && parsedFileText ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center">
                    <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{uploadedFile.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {(uploadedFile.size / 1024).toFixed(0)} KB · {parsedFileText.split(/\s+/).length.toLocaleString()} words extracted
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setUploadedFile(null);
                      setParsedFileText('');
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="text-xs font-semibold text-slate-500 hover:text-red-500 transition-colors mt-2 bg-white px-3 py-1 rounded-md border border-slate-200 shadow-sm"
                  >
                    Remove file
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center">
                    <svg className="w-7 h-7 text-[#1e3a8a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700">
                      Drop your resume here, or <span className="text-[#1e3a8a]">click to browse</span>
                    </p>
                    <p className="text-xs text-slate-500 mt-1">PDF or DOCX · Max 10 MB</p>
                  </div>
                </div>
              )}
            </div>

            {parseError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-start gap-2.5">
                <svg className="w-4 h-4 mt-0.5 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{parseError}</span>
              </div>
            )}
          </div>
        )}

        {/* ─── Job description (collapsible) ─── */}
        <div className="mt-6 border-t border-slate-200 pt-5">
          <button
            onClick={() => setShowJD(!showJD)}
            className="w-full flex items-center justify-between text-sm font-semibold text-slate-600 hover:text-[#1e3a8a] transition-colors"
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#1e3a8a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Add Job Description
              <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wide border border-blue-100">
                Optional
              </span>
            </span>
            <svg
              className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${showJD ? 'rotate-180' : ''}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showJD && (
            <div className="mt-4 animate-fade-in-up">
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here. We'll check how well your resume's keywords match the role..."
                rows={5}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 resize-none transition-all duration-200 focus:bg-white"
              />
            </div>
          )}
        </div>

        {/* ─── Submit button ─── */}
        <button
          onClick={handleSubmit}
          disabled={!canSubmit()}
          className={`
            mt-6 w-full relative flex items-center justify-center gap-2.5 py-4 px-6 rounded-xl font-bold text-base transition-all duration-200
            ${canSubmit()
              ? 'bg-[#1e3a8a] hover:bg-blue-900 text-white cursor-pointer shadow-md shadow-[#1e3a8a]/20 hover:-translate-y-0.5'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
            }
          `}
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin-slow" />
              <span>Analyzing your resume…</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              <span className="relative z-10 tracking-wide">Check My ATS Score</span>
            </>
          )}
        </button>

        {canSubmit() && !isLoading && (
          <p className="text-center text-xs text-slate-400 font-medium mt-3">
            Analysis takes 5–10 seconds · Your data is completely private
          </p>
        )}
      </div>
    </div>
  );
}
