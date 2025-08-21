import { View, Text, TextInput, Button, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';

export default function GoalScreen() {
  const router = useRouter();
  const [goal, setGoal] = useState('');

  const handleNext = () => {
    alert('Button clicked!');
    router.push('/onboarding/qualification');
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 16, gap: 12 }}>
      <Text>목표를 입력하세요</Text>
      <TextInput value={goal} onChangeText={setGoal} style={{ borderWidth: 1, padding: 8 }} />
      <TouchableOpacity 
        onPress={handleNext}
        style={{ 
          backgroundColor: '#007AFF', 
          padding: 12, 
          borderRadius: 8,
          alignItems: 'center' 
        }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>다음</Text>
      </TouchableOpacity>
    </View>
  );
}
