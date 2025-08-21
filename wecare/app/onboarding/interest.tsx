import { View, Text, TextInput } from 'react-native';
import { useState, useEffect } from 'react';
import { Link } from 'expo-router';
import { loadUser, saveUser } from '../../lib/storage';

export default function InterestScreen() {
  const [interest, setInterest] = useState('');

  useEffect(() => {
    loadUser().then((u) => setInterest(u.profile.interest));
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 16, gap: 12 }}>
      <Text>관심 직무를 입력하세요</Text>
      <TextInput value={interest} onChangeText={setInterest} style={{ borderWidth: 1, padding: 8 }} />
      <Link 
        href="/(tabs)/home"
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
        완료
      </Link>
    </View>
  );
}
