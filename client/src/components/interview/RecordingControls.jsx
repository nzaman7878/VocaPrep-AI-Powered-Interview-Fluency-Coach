import React from 'react';
import { Mic, Square, Pause, Play, Loader2 } from 'lucide-react';
import Button from '../ui/Button';

const formatTime = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
};

const RecordingControls = ({
  isRecording,
  isPaused,
  recordingTime = 0,
  onStart,
  onStop,
  onPause,
  onResume,
  isProcessing = false,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-8 glass-panel rounded-3xl">
      {/* Animated State Indicator & Timer */}
      <div
        className="flex items-center justify-center space-x-4 bg-surface-elevated/50 px-8 py-4 rounded-full border border-surface-elevated shadow-inner"
        aria-live="polite"
        aria-atomic="true"
      >
        {/* Blinking red dot when actively recording */}
        <div
          className={`w-3.5 h-3.5 rounded-full transition-colors duration-300 ${
            isRecording && !isPaused
              ? 'bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.6)]'
              : isPaused
                ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.6)]'
                : 'bg-surface-elevated'
          }`}
        />
        <span className="text-3xl font-mono font-bold tracking-wider text-text-primary">
          {formatTime(recordingTime)}
        </span>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center space-x-6">
        {!isRecording ? (
          <Button
            variant="primary"
            size="lg"
            onClick={onStart}
            disabled={isProcessing}
            className="w-56 h-16 rounded-full font-bold text-lg flex items-center justify-center space-x-2"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Mic className="w-6 h-6" />
                <span>Start Answer</span>
              </>
            )}
          </Button>
        ) : (
          <>
            {/* Pause / Resume Button */}
            <button
              onClick={isPaused ? onResume : onPause}
              className="flex items-center justify-center w-16 h-16 rounded-full bg-surface-elevated text-text-primary hover:bg-surface-elevated/80 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 border border-surface-elevated shadow-sm hover:scale-105"
              aria-label={isPaused ? 'Resume recording' : 'Pause recording'}
            >
              {isPaused ? (
                <Play className="w-7 h-7 ml-1 text-primary" />
              ) : (
                <Pause className="w-7 h-7" />
              )}
            </button>

            {/* Stop Button */}
            <Button
              variant="danger"
              size="lg"
              onClick={onStop}
              className="w-48 h-16 rounded-full font-bold text-lg flex items-center justify-center space-x-2 bg-red-500/10 text-red-600 hover:bg-red-500 hover:text-white border border-red-500/20 shadow-none transition-all dark:bg-red-500/20 dark:text-red-400 dark:hover:bg-red-500 dark:hover:text-white"
            >
              <Square className="w-5 h-5 fill-current" />
              <span>Finish</span>
            </Button>
          </>
        )}
      </div>

      {/* Helper text */}
      <div className="text-sm text-text-muted font-medium tracking-wide uppercase text-center" aria-live="polite">
        {isRecording && !isPaused && 'Speak clearly into your microphone'}
        {isPaused && 'Recording paused'}
        {!isRecording && !isProcessing && 'Press start when you are ready'}
        {isProcessing && 'Evaluating your answer...'}
      </div>
    </div>
  );
};

export default RecordingControls;
