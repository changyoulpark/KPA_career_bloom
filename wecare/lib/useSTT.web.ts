interface Options {
  onSpeech?: (text: string) => void;
}

export function useSTT(options: Options = {}) {
  const start = async () => {};
  const stop = async () => '';
  return { isRecording: false, transcript: '', start, stop };
}
