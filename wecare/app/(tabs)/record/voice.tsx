import { View, Text } from 'react-native';
import { useState } from 'react';
import VoiceMic from '../../../components/VoiceMic';
import { parseActivities } from '../../../lib/nlp';
import { saveActivity } from '../../../lib/storage';
import { Activity } from '../../../lib/types';

export default function VoiceScreen() {
  const [transcript, setTranscript] = useState('');
  const [activity, setActivity] = useState<Activity | null>(null);

  const handleStop = async (text: string) => {
    setTranscript(text);
    try {
      const acts = parseActivities(text);
      const saved: Activity[] = [];
      for (const a of acts) {
        const full: Activity = {
          id: Date.now().toString(),
          date: new Date().toISOString(),
          ...a,
        };
        await saveActivity(full);
        saved.push(full);
      }
      setActivity(saved[0] ?? null);
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16 }}>
      <VoiceMic onStop={handleStop} onTranscript={setTranscript} />
      <Text>{transcript}</Text>
      {activity && (
        <View style={{ marginTop: 16, alignItems: 'center' }}>
          <Text>{`요약: ${activity.note}`}</Text>
          <Text>{`태그: ${activity.tag}`}</Text>
          <Text>{`시간: ${Math.round(activity.durationSec / 60)}분`}</Text>
        </View>
      )}
    </View>
  );
}
