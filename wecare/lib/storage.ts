import AsyncStorage from '@react-native-async-storage/async-storage';
import { Activity, User } from './types';

const KEY = 'activities';
const USER_KEY = 'user';

export async function loadActivities(): Promise<Activity[]> {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function saveActivity(activity: Activity) {
  const list = await loadActivities();
  list.push(activity);
  await AsyncStorage.setItem(KEY, JSON.stringify(list));
  logEvent('activity_saved', { duration: activity.durationSec, tag: activity.tag });
}

export async function loadApplyCount(): Promise<number> {
  const raw = await AsyncStorage.getItem(APPLY_KEY);
  return raw ? Number(raw) : 0;
}

export async function saveApplyClick() {
  const count = await loadApplyCount();
  await AsyncStorage.setItem(APPLY_KEY, String(count + 1));
  logEvent('apply_click', { count: count + 1 });
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

export async function loadUser(): Promise<User> {
  const raw = await AsyncStorage.getItem(USER_KEY);
  return raw
    ? JSON.parse(raw)
    : {
        profile: { goal: '', qualification: '', interest: '' },
        settings: { notifications: { enabled: false, time: '09:00' } },
      };
}

export async function saveUser(user: User) {
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
}
