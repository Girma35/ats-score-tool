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

Return ONLY valid JSON with this exact structure (no markdown, no explanation, no code fences):
{
  "score": <number 0-100>,
  "feedback": [
    {
      "type": "strength",
      "title": "<short title, max 6 words>",
      "description": "<one sentence explanation, max 20 words>"
    },
    {
      "type": "issue",
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
- Output raw JSON only — no markdown fences, no preamble`;

// ─── Strip markdown fences and thinking blocks from AI output ────────────────
function cleanJSON(raw: string): string {
  // Remove <think>...</think> blocks which some reasoning models use
  let cleaned = raw.replace(/<think>[\s\S]*?<\/think>/gi, '');
  
  // Extract the JSON object from the remaining text
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  
  if (start !== -1 && end !== -1 && end > start) {
    cleaned = cleaned.substring(start, end + 1);
  } else {
    // Fallback if no clear brackets, just strip markdown
    cleaned = cleaned
      .replace(/```json\s*/gi, '')
      .replace(/```\s*/g, '')
      .trim();
  }
  
  return cleaned;
}

// ─── Provider: Groq (Free — Llama 3.3 70B) ───────────────────────────────────
async function callGroq(prompt: string): Promise<ScoreResult> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('GROQ_API_KEY is not set. Get a free key at console.groq.com');

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'qwen/qwen3.6-27b',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt },
      ],
      temperature: 0.3,
      max_tokens: 900,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Groq API error ${response.status}: ${err}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content as string | undefined;
  if (!content) throw new Error('Empty response from Groq');

  return JSON.parse(cleanJSON(content)) as ScoreResult;
}

// ─── Provider: Google Gemini (Free — gemini-2.0-flash) ───────────────────────
async function callGemini(prompt: string): Promise<ScoreResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY is not set. Get a free key at aistudio.google.com');

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: {
        parts: [{ text: SYSTEM_PROMPT }],
      },
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 900,
        responseMimeType: 'application/json',
      },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini API error ${response.status}: ${err}`);
  }

  const data = await response.json();
  const content =
    data?.candidates?.[0]?.content?.parts?.[0]?.text as string | undefined;
  if (!content) throw new Error('Empty response from Gemini');

  return JSON.parse(cleanJSON(content)) as ScoreResult;
}

// ─── Provider: Mistral (Free via La Plateforme — mistral-small-latest) ────────
async function callMistral(prompt: string): Promise<ScoreResult> {
  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) throw new Error('MISTRAL_API_KEY is not set. Get a free key at console.mistral.ai');

  const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'mistral-small-latest',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt },
      ],
      temperature: 0.3,
      max_tokens: 900,
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Mistral API error ${response.status}: ${err}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content as string | undefined;
  if (!content) throw new Error('Empty response from Mistral');

  return JSON.parse(cleanJSON(content)) as ScoreResult;
}

// ─── Validate AI response shape ───────────────────────────────────────────────
function validateResult(result: unknown): result is ScoreResult {
  if (typeof result !== 'object' || result === null) return false;
  const r = result as Record<string, unknown>;
  return (
    typeof r.score === 'number' &&
    r.score >= 0 &&
    r.score <= 100 &&
    Array.isArray(r.feedback) &&
    r.feedback.length >= 1
  );
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
      : `RESUME:\n${resumeText}\n\n(No job description provided — analyze based on general ATS best practices and common role keywords.)`;

    // Pick provider — default to groq
    const provider = (process.env.AI_PROVIDER || 'groq').toLowerCase();

    let result: ScoreResult;
    switch (provider) {
      case 'gemini':
        result = await callGemini(userPrompt);
        break;
      case 'mistral':
        result = await callMistral(userPrompt);
        break;
      case 'groq':
      default:
        result = await callGroq(userPrompt);
        break;
    }

    if (!validateResult(result)) {
      throw new Error('AI returned an invalid response shape. Please try again.');
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('[/api/score] Error:', error);
    const message =
      error instanceof Error ? error.message : 'An unexpected error occurred.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
