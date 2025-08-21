import { View, Text, TextInput } from 'react-native';
import { useState, useEffect } from 'react';
import { Link } from 'expo-router';
import { loadUser, saveUser } from '../../lib/storage';

export default function QualificationScreen() {
  const [qualification, setQualification] = useState('');

  useEffect(() => {
    loadUser().then((u) => setQualification(u.profile.qualification));
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 16, gap: 12 }}>
      <Text>자격을 입력하세요</Text>
      <TextInput
        value={qualification}
        onChangeText={setQualification}
        style={{ borderWidth: 1, padding: 8 }}
      />
      <Link 
        href="/onboarding/interest"
        style={{
          backgroundColor: '#007AFF',
          paddingHorizontal: 20,
          paddingVertical: 10,
          borderRadius: 5,
          textAlign: 'center',
          color: 'white',
          fontWeight: 'bold',
          textDecorationLine: 'none',
        }}
      >
        다음
      </Link>
    </View>
  );
}
