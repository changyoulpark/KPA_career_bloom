import AsyncStorage from '@react-native-async-storage/async-storage';
import { Activity, ActivityTag } from './types';

const KEY = 'activities';
const USER_KEY = 'user';

export interface UserProfile {
  goal: string;
  qualification: string;
  interest: string;
}

export interface User {
  profile: UserProfile;
}

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
  changePct: number;
  byTag: Record<ActivityTag, number>;
}

export async function loadWeeklySummary(): Promise<WeeklySummary> {
  const activities = await loadActivities();
  const now = Date.now();
  const weekMs = 7 * 24 * 60 * 60 * 1000;
  const currentStart = now - weekMs;
  const prevStart = now - 2 * weekMs;

  let total = 0;
  let prev = 0;
  const byTag: Record<ActivityTag, number> = {} as Record<ActivityTag, number>;

  for (const a of activities) {
    const t = new Date(a.date).getTime();
    if (t >= currentStart) {
      total += a.durationSec;
      byTag[a.tag] = (byTag[a.tag] || 0) + a.durationSec;
    } else if (t >= prevStart && t < currentStart) {
      prev += a.durationSec;
    }
  }

  const changePct = prev === 0 ? 0 : ((total - prev) / prev) * 100;
  return { total, changePct, byTag };
}

export async function loadUser(): Promise<User> {
  const raw = await AsyncStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : {
    profile: {
      goal: '',
      qualification: '',
      interest: ''
    }
  };
}

export async function saveUser(user: User): Promise<void> {
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
}
