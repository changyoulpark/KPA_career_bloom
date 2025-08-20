import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to onboarding as the app entry point
    router.replace('/onboarding');
  }, []);

  return null;
}