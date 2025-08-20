import { Activity, ActivityTag } from './types';

const stopWords: Set<string> = new Set([
  '오늘',
  '오전',
  '저녁',
  '오후',
  '그리고',
  '또',
  '또는',
  '에서',
  '에',
  '를',
  '을',
  '가',
  '이',
  '저',
  '나',
  '너',
  '한',
  '하나',
  '무슨',
  '몇',
  '개',
  '문항',
  '1개',
  '1',
  '2',
  '3',
  '4',
  '5',
]);

const tagRules: Record<ActivityTag, string[]> = {
  영단어: ['영단어', '단어장', '토익', '단어'],
  신문스크랩: ['신문', '스크랩'],
  러닝: ['러닝', '조깅', '달리기'],
  자기소개서: ['자소서', '자기소개서', '에세이'],
  코딩: ['코딩', '프로그래밍', '코드'],
  네트워킹: ['네트워킹', '모임', '만남'],
  자격증: ['자격증', '시험'],
  기타: [],
};

export function normalize(text: string): string {
  return text
    .replace(/\s+/g, ' ')
    .replace(/[.,!?]/g, ' ')
    .trim();
}

export function extractDuration(text: string): number {
  const hourMin = text.match(/(\d+)\s*시간\s*(\d+)?\s*분?/);
  if (hourMin) {
    const h = parseInt(hourMin[1], 10);
    const m = hourMin[2] ? parseInt(hourMin[2], 10) : 0;
    return h * 3600 + m * 60;
  }
  const minOnly = text.match(/(\d+)\s*분/);
  if (minOnly) {
    return parseInt(minOnly[1], 10) * 60;
  }
  return 25 * 60; // default 25m
}

export function matchCategory(text: string): ActivityTag {
  for (const [tag, keywords] of Object.entries(tagRules) as [ActivityTag, string[]][]) {
    if (keywords.some((k) => text.includes(k))) {
      return tag;
    }
  }
  return '기타';
}

export function topTerms(text: string, n = 3): string[] {
  const tokens = text
    .replace(/[^가-힣0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t && !stopWords.has(t));
  const freq: Map<string, number> = new Map();
  for (const t of tokens) {
    freq.set(t, (freq.get(t) || 0) + 1);
  }
  return Array.from(freq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([w]) => w);
}

function splitSegments(text: string): string[] {
  return text
    .split(/(?:,|그리고|그리고|또|그리고)/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function parseActivities(transcript: string): Omit<Activity, 'id' | 'date'>[] {
  const segments = splitSegments(transcript);
  const activities: Omit<Activity, 'id' | 'date'>[] = [];
  for (const seg of segments) {
    const norm = normalize(seg);
    if (!norm) continue;
    const durationSec = extractDuration(norm);
    const tag = matchCategory(norm);
    const keywords = topTerms(norm);
    activities.push({ durationSec, tag, note: seg.trim(), transcript: seg.trim(), keywords });
  }
  return activities;
}

