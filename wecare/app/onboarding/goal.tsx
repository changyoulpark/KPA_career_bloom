import { View, Text, TextInput } from 'react-native';
import { useState } from 'react';
import { Link } from 'expo-router';

export default function GoalScreen() {
  const [goal, setGoal] = useState('');

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 16, gap: 12 }}>
      <Text>목표를 입력하세요</Text>
      <TextInput value={goal} onChangeText={setGoal} style={{ borderWidth: 1, padding: 8 }} />
      <Link 
        href="/onboarding/qualification"
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
