import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Activity } from '../../lib/types';
import { loadActivities } from '../../lib/storage';

export default function Home() {
  const router = useRouter();
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    loadActivities().then(setActivities);
  }, []);

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Button title="음성 기록" onPress={() => router.push('/record/voice')} />
      {activities.map((a) => (
        <View key={a.id} style={{ marginTop: 8 }}>
          <Text>{`${a.tag} ${Math.round(a.durationSec / 60)}분`}</Text>
          <Text>{a.note}</Text>
        </View>
      ))}
    </View>
  );
}
