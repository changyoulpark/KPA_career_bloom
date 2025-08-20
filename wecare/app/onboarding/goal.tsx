import { View, Text, TextInput, Button } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { loadUser, saveUser } from '../../lib/storage';

export default function GoalScreen() {
  const router = useRouter();
  const [goal, setGoal] = useState('');

  useEffect(() => {
    loadUser().then((u) => setGoal(u.profile.goal));
  }, []);

  const handleNext = async () => {
    const user = await loadUser();
    const updated = { ...user, profile: { ...user.profile, goal } };
    await saveUser(updated);
    router.push('/onboarding/qualification');
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 16, gap: 12 }}>
      <Text>목표를 입력하세요</Text>
      <TextInput value={goal} onChangeText={setGoal} style={{ borderWidth: 1, padding: 8 }} />
      <Button title="다음" onPress={handleNext} />
    </View>
  );
}
