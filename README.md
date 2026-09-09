# ATS Resume Score Checker — WorkAtlas

A free, AI-powered ATS resume compatibility checker built for [workatlas.tech](https://workatlas.tech).

> **100% free AI** — no OpenAI required. Uses Groq, Gemini, or Mistral (all free tiers).

## Features

- 📄 Upload PDF/DOCX resume or paste resume text
- 🎯 Instant ATS compatibility score (0–100)
- 🔍 5-category analysis: Formatting, Keywords, Content, Structure, Red Flags
- 📋 Actionable feedback with strengths and issues
- 💼 Optional job description for targeted keyword matching
- 🔒 No accounts, no data storage — 100% private

## Tech Stack

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS** (v4)
- **AI (free)**: Groq Llama-3.3-70B · Google Gemini 2.0 Flash · Mistral Small
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

Choose **one** free provider and add its key to `.env.local`:

| Provider | Free Tier | Sign Up |
|---|---|---|
| **Groq** ⭐ (default) | Very generous, no card | [console.groq.com](https://console.groq.com) |
| **Google Gemini** | 1M tokens/day free | [aistudio.google.com](https://aistudio.google.com) |
| **Mistral** | Free trial credits | [console.mistral.ai](https://console.mistral.ai) |

```env
# Groq (recommended default)
AI_PROVIDER=groq
GROQ_API_KEY=gsk_...

# OR Gemini
# AI_PROVIDER=gemini
# GEMINI_API_KEY=AIza...

# OR Mistral
# AI_PROVIDER=mistral
# MISTRAL_API_KEY=...
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
