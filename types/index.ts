export interface FeedbackItem {
  type: 'strength' | 'issue';
  title: string;
  description: string;
}

export interface ScoreResult {
  score: number;
  feedback: FeedbackItem[];
}

export interface ScoreRequest {
  resumeText: string;
  jobDescription?: string;
}

export type ScoreColor = 'green' | 'yellow' | 'orange' | 'red';

export function getScoreColor(score: number): ScoreColor {
  if (score >= 80) return 'green';
  if (score >= 60) return 'yellow';
  if (score >= 40) return 'orange';
  return 'red';
}

export function getScoreLabel(score: number): string {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Fair';
  return 'Poor';
}

export function getScoreSubtext(score: number): string {
  if (score >= 80) return 'High chance of passing ATS filters';
  if (score >= 60) return 'Needs some improvements to pass ATS';
  if (score >= 40) return 'Several issues to fix before applying';
  return 'Major problems — significant revision needed';
}
