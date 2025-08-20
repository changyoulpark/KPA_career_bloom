import * as Amplitude from 'expo-analytics-amplitude';

const API_KEY = process.env.EXPO_PUBLIC_AMPLITUDE_API_KEY || '';

export function initAnalytics() {
  if (API_KEY) {
    Amplitude.initialize(API_KEY);
  }
}

export function logEvent(name: string, properties?: Record<string, any>) {
  if (API_KEY) {
    if (properties) {
      Amplitude.logEventWithProperties(name, properties);
    } else {
      Amplitude.logEvent(name);
    }
  }
}
