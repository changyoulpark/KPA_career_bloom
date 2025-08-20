import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { initAnalytics } from './lib/analytics';

export default function App() {
  useEffect(() => {
    initAnalytics();
  }, []);
  return <Stack />;
}
