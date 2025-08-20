import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function OnboardingIndex() {
  const router = useRouter();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16 }}>
      <Text>온보딩을 시작합니다</Text>
      <Button title="시작하기" onPress={() => router.push('/onboarding/goal')} />
    </View>
  );
}
