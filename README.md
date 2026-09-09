# ATS Resume Score Checker — WorkAtlas

A free, AI-powered ATS resume compatibility checker built for [workatlas.tech](https://workatlas.tech).

## Features

- 📄 Upload PDF/DOCX resume or paste resume text
- 🎯 Instant ATS compatibility score (0–100)
- 🔍 5-category analysis: Formatting, Keywords, Content, Structure, Red Flags
- 📋 Actionable feedback with strengths and issues
- 💼 Optional job description for targeted keyword matching
- 🔒 No accounts, no data storage — 100% private

## Tech Stack

- **Next.js 14+** (App Router) + TypeScript
- **Tailwind CSS** (v4)
- **AI**: OpenAI GPT-4o-mini or Groq Llama-3
- **PDF parsing**: pdfjs-dist
- **DOCX parsing**: mammoth

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your API key:

```env
# Choose OpenAI (recommended)
OPENAI_API_KEY=sk-...
AI_PROVIDER=openai

# Or Groq (free tier available)
# GROQ_API_KEY=gsk_...
# AI_PROVIDER=groq
```

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Scoring Model

| Category | Weight | What's Checked |
|---|---|---|
| ATS Formatting | 25% | Clean layout, no tables/columns, standard headings |
| Keywords Match | 30% | Skills, tools, job titles vs. job description |
| Content Strength | 20% | Action verbs, quantified achievements |
| Structure & Readability | 15% | Sections, length, contact info |
| Red Flags | 10% | Missing contact, spelling errors, photos, etc. |

## Score Scale

| Score | Rating | Meaning |
|---|---|---|
| 80–100 | 🟢 Excellent | High chance of passing ATS |
| 60–79 | 🟡 Good | Needs some improvements |
| 40–59 | 🟠 Fair | Several issues to fix |
| <40 | 🔴 Poor | Major revision needed |

## Deploy

Deploy to Vercel with one click — just add your environment variables in the Vercel dashboard.

---

Built with ❤️ by [WorkAtlas](https://workatlas.tech)
