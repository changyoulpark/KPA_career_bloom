import AsyncStorage from '@react-native-async-storage/async-storage';
import { Activity } from './types';
import { logEvent } from './analytics';

const KEY = 'activities';
const APPLY_KEY = 'applyClicks';

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
