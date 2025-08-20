import { useEffect, useRef, useState } from 'react';

interface Options {
  onSpeech?: (text: string) => void;
}

export function useSTT(options: Options = {}) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Try to initialise browser speech recognition if available
    const SpeechRecognition =
      typeof window !== 'undefined' &&
      ((window as any).webkitSpeechRecognition || (window as any).SpeechRecognition);
    if (SpeechRecognition) {
      const rec: SpeechRecognition = new SpeechRecognition();
      rec.lang = 'ko-KR';
      rec.continuous = true;
      rec.interimResults = true;
      rec.onresult = (event: SpeechRecognitionEvent) => {
        let text = '';
        for (const res of event.results) {
          text += res[0].transcript;
        }
        setTranscript(text);
        options.onSpeech?.(text);
      };
      recognitionRef.current = rec;
    }
    return () => {
      recognitionRef.current?.stop();
    };
  }, [options.onSpeech]);

  const start = async () => {
    setTranscript('');
    recognitionRef.current?.start?.();
    setIsRecording(true);
  };

  const stop = async () => {
    recognitionRef.current?.stop?.();
    setIsRecording(false);
    return transcript;
  };

  return { isRecording, transcript, start, stop };
}
