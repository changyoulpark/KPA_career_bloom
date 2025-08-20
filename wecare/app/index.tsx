import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to onboarding for now
    router.replace('/onboarding');
  }, [router]);

  return null;
}