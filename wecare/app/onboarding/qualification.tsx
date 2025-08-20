import { View, Text, TextInput, Button } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { loadUser, saveUser } from '../../lib/storage';

export default function QualificationScreen() {
  const router = useRouter();
  const [qualification, setQualification] = useState('');

  useEffect(() => {
    loadUser().then((u) => setQualification(u.profile.qualification));
  }, []);

  const handleNext = async () => {
    const user = await loadUser();
    const updated = { ...user, profile: { ...user.profile, qualification } };
    await saveUser(updated);
    router.push('/onboarding/interest');
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 16, gap: 12 }}>
      <Text>자격을 입력하세요</Text>
      <TextInput
        value={qualification}
        onChangeText={setQualification}
        style={{ borderWidth: 1, padding: 8 }}
      />
      <Button title="다음" onPress={handleNext} />
    </View>
  );
}
