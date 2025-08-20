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
