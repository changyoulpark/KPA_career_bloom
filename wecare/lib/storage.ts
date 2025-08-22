import AsyncStorage from '@react-native-async-storage/async-storage';
import { Activity, ActivityTag, User, MotivationMessage, MicroMission } from './types';

// Create a web-compatible storage wrapper
const WebStorage = {
  async getItem(key: string): Promise<string | null> {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.warn('Storage getItem error:', error);
      return null;
    }
  },
  
  async setItem(key: string, value: string): Promise<void> {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
        return;
      }
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.warn('Storage setItem error:', error);
    }
  }
};

const KEY = 'activities';
const USER_KEY = 'user';
const MESSAGES_KEY = 'motivation_messages';
const MISSIONS_KEY = 'micro_missions';

export async function loadActivities(): Promise<Activity[]> {
  const raw = await WebStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function saveActivity(activity: Activity) {
  const list = await loadActivities();
  list.push(activity);
  await WebStorage.setItem(KEY, JSON.stringify(list));
}

export async function loadUser(): Promise<User> {
  const raw = await WebStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : {
    id: Date.now().toString(),
    profile: {
      goal: '',
      qualification: '',
      interest: ''
    }
  };
}

export async function saveUser(user: User): Promise<void> {
  await WebStorage.setItem(USER_KEY, JSON.stringify(user));
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

// Motivation Messages
export async function loadMotivationMessages(): Promise<MotivationMessage[]> {
  const raw = await WebStorage.getItem(MESSAGES_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function saveMotivationMessage(message: MotivationMessage): Promise<void> {
  const messages = await loadMotivationMessages();
  messages.push(message);
  // Keep only last 50 messages
  const recent = messages.slice(-50);
  await WebStorage.setItem(MESSAGES_KEY, JSON.stringify(recent));
}

export async function saveMotivationMessages(messages: MotivationMessage[]): Promise<void> {
  await WebStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
}

// Micro Missions
export async function loadMicroMissions(): Promise<MicroMission[]> {
  const raw = await WebStorage.getItem(MISSIONS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function saveMicroMissions(missions: MicroMission[]): Promise<void> {
  await WebStorage.setItem(MISSIONS_KEY, JSON.stringify(missions));
}

export async function completeMission(missionId: string): Promise<void> {
  const missions = await loadMicroMissions();
  const mission = missions.find(m => m.id === missionId);
  if (mission) {
    mission.completed = true;
    mission.dateCompleted = new Date().toISOString();
    await saveMicroMissions(missions);
  }
}
