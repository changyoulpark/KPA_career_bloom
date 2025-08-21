import { View, Text } from 'react-native';
import { Link } from 'expo-router';

export default function Index() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16 }}>
      <Text>온보딩을 시작합니다</Text>
      <Link 
        href="/onboarding/goal"
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
        시작하기
      </Link>
    </View>
  );
}