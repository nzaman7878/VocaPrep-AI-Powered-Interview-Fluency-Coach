import React, { useRef, useEffect } from 'react';
import useAudioAnalyser from '../../hooks/useAudioAnalyser';

const AudioVisualizer = ({
  mediaStream,
  isRecording = false,
  type = 'waveform', // 'waveform' or 'bars'
  color = '#8b5cf6', // Primary brand color
  height = 120,
}) => {
  const canvasRef = useRef(null);
  const analyser = useAudioAnalyser(mediaStream);
  const requestRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const canvasCtx = canvas.getContext('2d');

    // Handle high DPI displays to prevent blurry rendering
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    // We only resize if the physical pixels change
    if (canvas.width !== rect.width * dpr || canvas.height !== height * dpr) {
      canvas.width = rect.width * dpr;
      canvas.height = height * dpr;
      canvasCtx.scale(dpr, dpr);
    }

    // A subtle idle sine wave animation
    const drawIdleWave = (ctx, w, h) => {
      const time = Date.now() / 1000;
      ctx.beginPath();
      ctx.moveTo(0, h / 2);
      for (let i = 0; i < w; i++) {
        // Subtle moving sine wave
        const y = h / 2 + Math.sin(i * 0.05 + time * 2) * 5;
        ctx.lineTo(i, y);
      }
      ctx.stroke();
    };

    const render = () => {
      const w = rect.width;
      const h = height;

      // Clear the canvas on every frame
      canvasCtx.clearRect(0, 0, w, h);

      if (!analyser || !isRecording) {
        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = color + '80'; // 50% opacity hex
        drawIdleWave(canvasCtx, w, h);
        requestRef.current = requestAnimationFrame(render);
        return;
      }

      // Dynamic rendering when recording
      if (type === 'waveform') {
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteTimeDomainData(dataArray);

        canvasCtx.lineWidth = 3;
        canvasCtx.strokeStyle = color;

        // Premium glow effect
        canvasCtx.shadowBlur = 12;
        canvasCtx.shadowColor = color;

        canvasCtx.beginPath();
        const sliceWidth = (w * 1.0) / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0; // Normalizes to 0-2
          const y = (v * h) / 2;

          if (i === 0) {
            canvasCtx.moveTo(x, y);
          } else {
            canvasCtx.lineTo(x, y);
          }
          x += sliceWidth;
        }

        canvasCtx.lineTo(w, h / 2);
        canvasCtx.stroke();

        // Reset shadow so it doesn't build up
        canvasCtx.shadowBlur = 0;
      } else if (type === 'bars') {
        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);

        const barWidth = (w / bufferLength) * 2.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          barHeight = (dataArray[i] / 255) * h;

          // Vertical gradient for frequency bars
          const gradient = canvasCtx.createLinearGradient(0, h, 0, h - barHeight);
          gradient.addColorStop(0, color + '20');
          gradient.addColorStop(1, color);

          canvasCtx.fillStyle = gradient;

          // Modern rounded bars
          canvasCtx.beginPath();
          if (canvasCtx.roundRect) {
            canvasCtx.roundRect(x, h - barHeight, barWidth - 2, barHeight, [4, 4, 0, 0]);
          } else {
            // Fallback for older browsers
            canvasCtx.fillRect(x, h - barHeight, barWidth - 2, barHeight);
          }
          canvasCtx.fill();

          x += barWidth;
        }
      }

      requestRef.current = requestAnimationFrame(render);
    };

    // Kickstart the render loop
    render();

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [analyser, isRecording, type, color, height]);

  return (
    <div className="w-full relative rounded-xl overflow-hidden bg-surface-50 dark:bg-surface-900 border border-border-light dark:border-border-dark p-4 shadow-inner">
      <canvas
        ref={canvasRef}
        className="w-full"
        style={{ height: `${height}px`, display: 'block' }}
      />
      {!isRecording && (
        <div className="absolute inset-0 flex items-center justify-center bg-surface-50/60 dark:bg-surface-900/60 backdrop-blur-sm transition-all duration-300">
          <span className="text-sm font-semibold tracking-wide text-text-secondary animate-pulse">
            Microphone Ready
          </span>
        </div>
      )}
    </div>
  );
};

export default AudioVisualizer;
