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
  total: number; // seconds
  changePct: number; // percent vs previous week
  byTag: Record<ActivityTag, number>; // seconds per tag for current week
}

export async function loadWeeklySummary(): Promise<WeeklySummary> {
  const activities = await loadActivities();

  const now = new Date();
  const startOfWeek = new Date(now);
  const day = startOfWeek.getDay();
  const diffToMonday = (day + 6) % 7; // Monday as start
  startOfWeek.setDate(startOfWeek.getDate() - diffToMonday);
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 7);

  const startOfPrevWeek = new Date(startOfWeek);
  startOfPrevWeek.setDate(startOfPrevWeek.getDate() - 7);

  const inRange = (d: Date, start: Date, end: Date) => d >= start && d < end;
  const sum = (list: Activity[]) => list.reduce((acc, a) => acc + a.durationSec, 0);

  const currWeek = activities.filter((a) => inRange(new Date(a.date), startOfWeek, endOfWeek));
  const prevWeek = activities.filter((a) => inRange(new Date(a.date), startOfPrevWeek, startOfWeek));

  const total = sum(currWeek);
  const prevTotal = sum(prevWeek);
  const changePct = prevTotal ? ((total - prevTotal) / prevTotal) * 100 : 0;

  const byTag: Record<ActivityTag, number> = {};
  currWeek.forEach((a) => {
    byTag[a.tag] = (byTag[a.tag] || 0) + a.durationSec;
  });

  return { total, changePct, byTag };
}
