export type ActivityTag =
  | '영단어'
  | '신문스크랩'
  | '러닝'
  | '자기소개서'
  | '코딩'
  | '네트워킹'
  | '자격증'
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

export interface UserProfile {
  goal: string;
  qualification: string;
  interest: string;
}

export interface User {
  id: string;
  profile: UserProfile;
}
