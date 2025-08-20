import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Activity } from '../../lib/types';
import { loadActivities } from '../../lib/storage';
import Card from '../../components/Card';
import { Ionicons } from '@expo/vector-icons';

export default function Home() {
  const router = useRouter();
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    loadActivities().then(setActivities);
  }, []);

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Card
        text="Reflect"
        icon={<Ionicons name="create-outline" size={24} color="black" />}
        onPress={() => router.push('/reflect')}
      />
      <Card
        text="Voice"
        icon={<Ionicons name="mic-outline" size={24} color="black" />}
        onPress={() => router.push('/voice')}
      />
      <Card
        text="Check"
        icon={<Ionicons name="checkmark-outline" size={24} color="black" />}
        onPress={() => router.push('/check')}
      />
      {activities.map((a) => (
        <View key={a.id} style={{ marginTop: 8 }}>
          <Text>{`${a.tag} ${Math.round(a.durationSec / 60)}분`}</Text>
          <Text>{a.note}</Text>
        </View>
      ))}
    </View>
  );
}
