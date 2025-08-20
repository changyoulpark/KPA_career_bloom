import { View, Text, TextInput, Button } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { loadUser, saveUser } from '../../lib/storage';

export default function InterestScreen() {
  const router = useRouter();
  const [interest, setInterest] = useState('');

  useEffect(() => {
    loadUser().then((u) => setInterest(u.profile.interest));
  }, []);

  const handleDone = async () => {
    const user = await loadUser();
    const updated = { ...user, profile: { ...user.profile, interest } };
    await saveUser(updated);
    router.replace('/(tabs)/home');
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 16, gap: 12 }}>
      <Text>관심 직무를 입력하세요</Text>
      <TextInput value={interest} onChangeText={setInterest} style={{ borderWidth: 1, padding: 8 }} />
      <Button title="완료" onPress={handleDone} />
    </View>
  );
}
