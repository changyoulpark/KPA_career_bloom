import AsyncStorage from '@react-native-async-storage/async-storage';
import { Activity, ActivityTag } from './types';

const KEY = 'activities';

export async function loadActivities(): Promise<Activity[]> {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function saveActivity(activity: Activity) {
  const list = await loadActivities();
  list.push(activity);
  await AsyncStorage.setItem(KEY, JSON.stringify(list));
}

export interface WeeklySummary {
  total: number;
  percentChange: number;
  byTag: Record<ActivityTag, number>;
}

export async function loadWeeklySummary(): Promise<WeeklySummary> {
  const activities = await loadActivities();
  const now = new Date();
  const day = now.getDay();
  const diff = day === 0 ? -6 : 1 - day; // Monday as first day
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() + diff);
  startOfWeek.setHours(0, 0, 0, 0);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);
  const startOfPrevWeek = new Date(startOfWeek);
  startOfPrevWeek.setDate(startOfWeek.getDate() - 7);

  const currentWeek: Activity[] = [];
  const prevWeek: Activity[] = [];
  for (const a of activities) {
    const d = new Date(a.date);
    if (d >= startOfWeek && d < endOfWeek) currentWeek.push(a);
    else if (d >= startOfPrevWeek && d < startOfWeek) prevWeek.push(a);
  }

  const total = currentWeek.reduce((sum, a) => sum + a.durationSec, 0);
  const prevTotal = prevWeek.reduce((sum, a) => sum + a.durationSec, 0);
  const percentChange = prevTotal
    ? ((total - prevTotal) / prevTotal) * 100
    : 0;

  const tags: ActivityTag[] = [
    '영단어',
    '신문스크랩',
    '러닝',
    '자기소개서',
    '코딩',
    '네트워킹',
    '자격증',
    '기타',
  ];
  const byTag: Record<ActivityTag, number> = Object.fromEntries(
    tags.map((t) => [t, 0]),
  ) as Record<ActivityTag, number>;
  for (const a of currentWeek) {
    byTag[a.tag] += a.durationSec;
  }
  for (const t of tags) {
    byTag[t] = total ? (byTag[t] / total) * 100 : 0;
  }

  return { total, percentChange, byTag };
}
