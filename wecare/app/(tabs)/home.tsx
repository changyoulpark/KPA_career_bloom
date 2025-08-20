import { View, Text, Button, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Activity, User } from '../../lib/types';
import { loadActivities, loadUser, saveUser } from '../../lib/storage';
import {
  scheduleDailyNotification,
  cancelNotifications,
  registerForPushNotificationsAsync,
} from '../notifications';

export default function Home() {
  const router = useRouter();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [time, setTime] = useState('09:00');

  useEffect(() => {
    loadActivities().then(setActivities);
    loadUser().then((u) => {
      setUser(u);
      setTime(u.settings.notifications.time);
    });
  }, []);

  const enable = async () => {
    if (!(await registerForPushNotificationsAsync())) return;
    await scheduleDailyNotification(time);
    const updated = {
      ...user!,
      settings: { notifications: { enabled: true, time } },
    };
    await saveUser(updated);
    setUser(updated);
  };

  const disable = async () => {
    await cancelNotifications();
    const updated = {
      ...user!,
      settings: { notifications: { enabled: false, time } },
    };
    await saveUser(updated);
    setUser(updated);
  };

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Button title="음성 기록" onPress={() => router.push('/record/voice')} />
      {user && (
        <View style={{ padding: 12, borderWidth: 1, borderColor: '#ccc', marginTop: 8, gap: 8 }}>
          {user.settings.notifications.enabled ? (
            <>
              <Text>{`알림 시간: ${user.settings.notifications.time}`}</Text>
              <Button title="알림 해제" onPress={disable} />
            </>
          ) : (
            <>
              <Text>알림을 받을 시간을 입력하세요 (HH:MM)</Text>
              <TextInput
                value={time}
                onChangeText={setTime}
                style={{ borderWidth: 1, padding: 8 }}
              />
              <Button title="알림 설정" onPress={enable} />
            </>
          )}
        </View>
      )}
      {activities.map((a) => (
        <View key={a.id} style={{ marginTop: 8 }}>
          <Text>{`${a.tag} ${Math.round(a.durationSec / 60)}분`}</Text>
          <Text>{a.note}</Text>
        </View>
      ))}
    </View>
  );
}
