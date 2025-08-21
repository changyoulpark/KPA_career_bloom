
import { useState, useCallback } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import useTimer from '../../../lib/useTimer';
import { saveActivity } from '../../../lib/storage';
import { Activity } from '../../../lib/types';

function formatTime(sec: number) {
  const m = Math.floor(sec / 60)
    .toString()
    .padStart(2, '0');
  const s = Math.floor(sec % 60)
    .toString()
    .padStart(2, '0');
  return `${m}:${s}`;
}

export default function TimerScreen() {
  const [goal, setGoal] = useState('');
  const goalSec = parseInt(goal) ? parseInt(goal) * 60 : 0;

  const handleFinish = useCallback(async () => {
    const activity: Activity = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      durationSec: goalSec || elapsed,
      tag: '기타',
      note: '타이머 기록',
      keywords: [],
    };
    await saveActivity(activity);
  }, [goalSec]);

  const { elapsed, isRunning, start, stop, reset } = useTimer({
    targetSec: goalSec || undefined,
    onFinish: handleFinish,
  });

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16 }}>
      <TextInput
        style={{ borderWidth: 1, width: 200, padding: 8, textAlign: 'center' }}
        keyboardType="number-pad"
        placeholder="목표 시간(분)"
        value={goal}
        onChangeText={setGoal}
      />
      <Text>{formatTime(elapsed)}</Text>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Button title="시작" onPress={start} disabled={isRunning} />
        <Button title="정지" onPress={stop} disabled={!isRunning} />
        <Button title="리셋" onPress={reset} />
      </View>
    </View>
  );
}

