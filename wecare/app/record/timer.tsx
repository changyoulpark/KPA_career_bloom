import { View, Text, Button } from 'react-native';
import { useState } from 'react';
import { useTimer } from '../../lib/useTimer';
import { saveActivity } from '../../lib/storage';
import { Activity } from '../../lib/types';

const TARGET_SEC = 1500;

function format(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function TimerScreen() {
  const [done, setDone] = useState(false);

  const handleEnd = async (durationSec: number) => {
    const activity: Activity = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      durationSec,
      tag: '기타',
      note: '타이머',
      keywords: [],
    };
    await saveActivity(activity);
    setDone(true);
  };

  const { elapsed, start, stop } = useTimer({ targetSec: TARGET_SEC, onEnd: handleEnd });

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16 }}>
      <Text>{`목표: ${format(TARGET_SEC)}`}</Text>
      <Text>{`경과: ${format(elapsed)}`}</Text>
      <Button title="Start" onPress={start} />
      <Button title="Stop" onPress={stop} />
      {done && <Text>저장 완료</Text>}
    </View>
  );
}

