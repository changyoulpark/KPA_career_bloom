import { useEffect, useRef, useState } from 'react';

interface Options {
  onSpeech?: (text: string) => void;
}

export function useSTT(options: Options = {}) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = 'ko-KR';
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        let text = '';
        for (const res of event.results) {
          text += res[0].transcript;
        }
        setTranscript(text);
        options.onSpeech?.(text);
      };
    }
    return () => {
      recognitionRef.current?.stop();
    };
  }, [options.onSpeech]);

  const start = async () => {
    setTranscript('');
    recognitionRef.current?.start();
    setIsRecording(true);
  };

  const stop = async () => {
    recognitionRef.current?.stop();
    setIsRecording(false);
    return transcript;
  };

  return { isRecording, transcript, start, stop };
}
