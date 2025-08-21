import type { Activity, ActivityTag } from './types.ts';

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
  영단어: ['영단어', '단어장', '토익', '단어', '영어', '토플'],
  신문스크랩: ['신문', '스크랩', '뉴스', '기사'],
  러닝: ['러닝', '조깅', '달리기', '운동', '헬스'],
  자기소개서: ['자소서', '자기소개서', '에세이', '자기소개'],
  코딩: ['코딩', '프로그래밍', '코드', '개발', '알고리즘'],
  네트워킹: ['네트워킹', '모임', '만남', '세미나', '컨퍼런스'],
  자격증: ['자격증', '시험', '자격', '시험준비'],
  면접준비: ['면접', '면접준비', '모의면접', '면접연습'],
  포트폴리오: ['포트폴리오', '작품', '결과물', '프로젝트결과'],
  기업분석: ['기업분석', '회사분석', '채용공고', '기업연구'],
  온라인강의: ['강의', '온라인강의', '인강', '강의수강', '수업'],
  독서: ['독서', '책', '독서', '전공서적'],
  프로젝트: ['프로젝트', '과제', '팀플', '팀프로젝트'],
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

