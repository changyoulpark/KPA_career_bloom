import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Activity } from '../../lib/types';

import { loadActivities } from '../../lib/storage';
import Card from '../../components/Card';


export default function Home() {
  const router = useRouter();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [cardOrder, setCardOrder] = useState<Array<'reflect' | 'voice' | 'check'>>([
    'reflect',
    'voice',
    'check',
  ]);

  useEffect(() => {
    loadActivities().then((list) => {
      setActivities(list);
      setCardOrder(list.length === 0 ? ['check', 'voice', 'reflect'] : ['reflect', 'voice', 'check']);
    });
  }, []);

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      {cardOrder.map((key) => {
        const titles = { reflect: '회고', voice: '음성 기록', check: '체크인' } as const;
        const routes = { reflect: '/reflect', voice: '/voice', check: '/check' } as const;
        return (
          <Card
            key={key}
            title={titles[key]}
            onPress={() => router.push(routes[key])}
          />
        );
      })}
      {activities.map((a) => (
        <View key={a.id} style={{ marginTop: 8 }}>
          <Text>{`${a.tag} ${Math.round(a.durationSec / 60)}분`}</Text>
          <Text>{a.note}</Text>
        </View>
      ))}
    </View>
  );
}
