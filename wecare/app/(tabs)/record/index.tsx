import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function RecordScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, padding: 16, gap: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 32 }}>
        기록하기
      </Text>
      
      <Pressable
        style={{
          backgroundColor: '#007AFF',
          padding: 20,
          borderRadius: 12,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
        }}
        onPress={() => router.push('/record/timer')}
      >
        <Ionicons name="timer-outline" size={24} color="white" />
        <View style={{ flex: 1 }}>
          <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
            타이머 기록
          </Text>
          <Text style={{ color: 'white', opacity: 0.8 }}>
            시간을 설정하고 활동을 기록하세요
          </Text>
        </View>
      </Pressable>

      <Pressable
        style={{
          backgroundColor: '#28a745',
          padding: 20,
          borderRadius: 12,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
        }}
        onPress={() => router.push('/record/voice')}
      >
        <Ionicons name="mic-outline" size={24} color="white" />
        <View style={{ flex: 1 }}>
          <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
            음성 기록
          </Text>
          <Text style={{ color: 'white', opacity: 0.8 }}>
            음성으로 활동 내용을 기록하세요
          </Text>
        </View>
      </Pressable>
    </View>
  );
}