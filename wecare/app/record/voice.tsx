import { View, Text } from 'react-native';
import { useState } from 'react';
import VoiceMic from '../../components/VoiceMic';
import { summarizeAndTag } from '../../lib/gemini';
import { saveActivity } from '../../lib/storage';
import { Activity } from '../../lib/types';
import { parseActivities } from '../../lib/nlp';

export default function VoiceScreen() {
  const [transcript, setTranscript] = useState('');
  const [activity, setActivity] = useState<Activity | null>(null);

  const handleStop = async (text: string) => {
    setTranscript(text);
    try {
      let result: Omit<Activity, 'id' | 'date'> | null = null;
      const parsed = parseActivities(text)[0];
      if (parsed) {
        result = parsed;
      } else {
        const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';
        result = await summarizeAndTag(text, apiKey);
      }
      const full: Activity = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        ...result,
      };
      await saveActivity(full);
      setActivity(full);
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
