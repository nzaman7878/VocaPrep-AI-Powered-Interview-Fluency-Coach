import { useState, useEffect, useRef } from 'react';

const useAudioAnalyser = (mediaStream) => {
  const [analyser, setAnalyser] = useState(null);
  const audioContextRef = useRef(null);

  useEffect(() => {
    if (!mediaStream) {
      setAnalyser(null);
      return;
    }

    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioContext();
      audioContextRef.current = audioCtx;

      const analyserNode = audioCtx.createAnalyser();

      // Fine-tune defaults for a smoother waveform
      analyserNode.fftSize = 2048;
      analyserNode.smoothingTimeConstant = 0.85;

      const source = audioCtx.createMediaStreamSource(mediaStream);
      source.connect(analyserNode);

      setAnalyser(analyserNode);

      return () => {
        source.disconnect();
        analyserNode.disconnect();
        if (audioCtx.state !== 'closed') {
          audioCtx.close().catch(console.error);
        }
      };
    } catch (err) {
      console.error('Failed to initialize AudioContext', err);
    }
  }, [mediaStream]);

  return analyser;
};

export default useAudioAnalyser;
