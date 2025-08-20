import Voice from '@react-native-voice/voice';
import { useEffect, useState } from 'react';

interface Options {
  onSpeech?: (text: string) => void;
}

export function useSTT(options: Options = {}) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');

  useEffect(() => {
    Voice.onSpeechResults = (e) => {
      const t = e.value?.[0] ?? '';
      setTranscript(t);
      options.onSpeech?.(t);
    };
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, [options.onSpeech]);

  const start = async () => {
    setTranscript('');
    try {
      await Voice.start('ko-KR');
      setIsRecording(true);
    } catch (e) {
      console.warn(e);
    }
  };

  const stop = async () => {
    try {
      await Voice.stop();
    } catch (e) {
      console.warn(e);
    }
    setIsRecording(false);
    return transcript;
  };

  return { isRecording, transcript, start, stop };
}
