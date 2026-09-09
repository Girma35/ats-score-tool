import { NextRequest, NextResponse } from 'next/server';
import type { ScoreRequest, ScoreResult } from '@/types';

// ─── System Prompt ────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are an expert ATS (Applicant Tracking System) resume analyzer. Your job is to evaluate resumes and return a structured JSON score.

Analyze the resume across these 5 weighted categories:

1. ATS Formatting (25 points)
   - +25: Simple layout, standard headings, no tables/columns/images
   - +15–20: Mostly good, minor issues
   - +5–10: Has tables, columns, or graphics that ATS may misread
   - 0: Heavy design (Canva-style, multi-column, icons, graphics)

2. Keywords Match (30 points)
   - If job description provided: compare skills, tools, job titles, responsibilities
   - If no job description: check for strong relevant keywords for the detected role
   - Score based on % of important keywords found

3. Content Strength (20 points)
   - Strong action verbs (Led, Built, Increased, Achieved, Managed, Developed) → higher score
   - Quantified achievements (numbers, percentages, metrics) → higher score
   - Weak language ("Responsible for", "Helped with", "Assisted") → lower score

4. Structure & Readability (15 points)
   - Clear sections (Summary/Objective, Experience, Education, Skills)
   - Good length (1–2 pages ideal)
   - Contact information present (name, email, phone)
   - Consistent formatting

5. Red Flags (10 points — deduct for problems)
   - Missing email or phone
   - Spelling/grammar errors
   - Photo or personal details (age, marital status, nationality)
   - Unprofessional email address
   - Very long (3+ pages) or very short (< half page) resume
   - Outdated format indicators

Return ONLY valid JSON with this exact structure (no markdown, no explanation):
{
  "score": <number 0-100>,
  "feedback": [
    {
      "type": "strength" | "issue",
      "title": "<short title, max 6 words>",
      "description": "<one sentence explanation, max 20 words>"
    }
  ]
}

Rules:
- Return 4 to 6 feedback items total
- Mix strengths and issues honestly
- Score 80–100 = Excellent, 60–79 = Good, 40–59 = Fair, <40 = Poor
- Be specific and actionable in descriptions
- Never return markdown, only raw JSON`;

// ─── Helper: call OpenAI ─────────────────────────────────────────────────────
async function callOpenAI(prompt: string): Promise<ScoreResult> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt },
      ],
      temperature: 0.3,
      max_tokens: 800,
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenAI error ${response.status}: ${err}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error('Empty response from OpenAI');
  return JSON.parse(content) as ScoreResult;
}

// ─── Helper: call Groq ───────────────────────────────────────────────────────
async function callGroq(prompt: string): Promise<ScoreResult> {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt },
      ],
      temperature: 0.3,
      max_tokens: 800,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Groq error ${response.status}: ${err}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error('Empty response from Groq');

  // Groq may wrap JSON in markdown — strip it
  const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  return JSON.parse(cleaned) as ScoreResult;
}

// ─── Main Route Handler ───────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ScoreRequest;
    const { resumeText, jobDescription } = body;

    if (!resumeText || resumeText.trim().length < 50) {
      return NextResponse.json(
        { error: 'Resume text is too short. Please provide at least 50 characters.' },
        { status: 400 }
      );
    }

    // Build user prompt
    const userPrompt = jobDescription?.trim()
      ? `RESUME:\n${resumeText}\n\nJOB DESCRIPTION:\n${jobDescription}`
      : `RESUME:\n${resumeText}\n\n(No job description provided — analyze based on general ATS best practices)`;

    const provider = process.env.AI_PROVIDER || 'openai';

    let result: ScoreResult;
    if (provider === 'groq') {
      result = await callGroq(userPrompt);
    } else {
      result = await callOpenAI(userPrompt);
    }

    // Validate response shape
    if (
      typeof result.score !== 'number' ||
      result.score < 0 ||
      result.score > 100 ||
      !Array.isArray(result.feedback)
    ) {
      throw new Error('Invalid response shape from AI');
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('[/api/score] Error:', error);

    const message =
      error instanceof Error ? error.message : 'An unexpected error occurred';

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
