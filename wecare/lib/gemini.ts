import { Activity } from './types';

const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export async function summarizeAndTag(
  transcript: string,
  apiKey: string
): Promise<Omit<Activity, 'id' | 'date'>> {
  const prompt =
    `한국어 음성 인식 결과를 활동 로그 JSON으로 변환해줘.\n` +
    `스키마: {durationSec:number, tag:string, keywords:string[], note:string}\n` +
    `규칙: 시간 없으면 기본 1500초(25분). 태그 매핑: {영단어|단어장|토익}->영단어,{신문|스크랩}->신문스크랩,{러닝|조깅}->러닝,{자소서|에세이}->자기소개서.\n` +
    `입력: ${transcript}`;

  const res = await fetch(`${API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    }),
  });
  const json = await res.json();
  const text = json?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
  return JSON.parse(text);
}
