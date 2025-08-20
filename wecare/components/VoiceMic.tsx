import { TouchableOpacity, Text } from 'react-native';
import { useSTT } from '../lib/useSTT';

interface Props {
  onStop: (text: string) => void;
  onTranscript?: (text: string) => void;
}

export default function VoiceMic({ onStop, onTranscript }: Props) {
  const { isRecording, start, stop } = useSTT({ onSpeech: onTranscript });

  const handlePress = async () => {
    if (isRecording) {
      const text = await stop();
      onStop(text);
    } else {
      await start();
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} style={{ padding: 24, borderRadius: 48, backgroundColor: '#0052FF' }}>
      <Text style={{ color: '#fff', fontSize: 18 }}>{isRecording ? 'Stop' : 'Rec'}</Text>
    </TouchableOpacity>
  );
}
