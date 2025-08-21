export type ActivityTag =
  | '영단어'
  | '신문스크랩'
  | '러닝'
  | '자기소개서'
  | '코딩'
  | '네트워킹'
  | '자격증'
  | '면접준비'
  | '포트폴리오'
  | '기업분석'
  | '온라인강의'
  | '독서'
  | '프로젝트'
  | '기타';

export interface Activity {
  id: string;
  date: string; // ISO
  durationSec: number;
  tag: ActivityTag;
  note: string;
  transcript?: string;
  keywords: string[];
}

export interface Profile {
  goal: string;
  qualification: string;
  interest: string;
}

export interface User {
  id: string;
  profile: Profile;
}

export interface MotivationMessage {
  id: string;
  message: string;
  type: 'encouragement' | 'achievement' | 'nudge' | 'milestone';
  data?: {
    improvement?: string;
    timeSpent?: number;
    streakDays?: number;
  };
  timestamp: string;
}

export interface MicroMission {
  id: string;
  title: string;
  description: string;
  category: ActivityTag;
  targetDuration?: number; // in seconds
  completed: boolean;
  dateAssigned: string;
  dateCompleted?: string;
}
