import React from 'react';
import { Mic, Square, Pause, Play, Loader2 } from 'lucide-react';
import Button from '../ui/Button'; // Assuming Button component from design system

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
  isProcessing = false, // Optional state if waiting for AI transcription
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-6 bg-surface-50 dark:bg-surface-900 rounded-2xl border border-border-light dark:border-border-dark shadow-sm">
      {/* Animated State Indicator & Timer */}
      <div className="flex items-center justify-center space-x-3 bg-surface-100 dark:bg-surface-800 px-6 py-3 rounded-full border border-border-light dark:border-border-dark">
        {/* Blinking red dot when actively recording */}
        <div
          className={`w-3 h-3 rounded-full transition-colors duration-300 ${
            isRecording && !isPaused
              ? 'bg-red-500 animate-pulse'
              : isPaused
                ? 'bg-yellow-500'
                : 'bg-gray-400 dark:bg-gray-600'
          }`}
        />
        <span className="text-2xl font-mono tracking-widest text-text-primary">
          {formatTime(recordingTime)}
        </span>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center space-x-4">
        {!isRecording ? (
          <Button
            variant="primary"
            size="lg"
            onClick={onStart}
            disabled={isProcessing}
            className="w-48 h-14 rounded-full font-semibold text-lg flex items-center justify-center space-x-2 shadow-lg shadow-primary-500/30 transition-transform active:scale-95"
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
              className="flex items-center justify-center w-14 h-14 rounded-full bg-surface-200 dark:bg-surface-700 text-text-secondary hover:bg-surface-300 dark:hover:bg-surface-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-surface-900"
              aria-label={isPaused ? 'Resume recording' : 'Pause recording'}
            >
              {isPaused ? (
                <Play className="w-6 h-6 ml-1 text-primary-500" />
              ) : (
                <Pause className="w-6 h-6" />
              )}
            </button>

            {/* Stop Button */}
            <Button
              variant="danger"
              size="lg"
              onClick={onStop}
              className="w-40 h-14 rounded-full font-semibold text-lg flex items-center justify-center space-x-2 shadow-lg shadow-red-500/30 transition-transform active:scale-95 bg-red-500 hover:bg-red-600 text-white"
            >
              <Square className="w-5 h-5 fill-current" />
              <span>Finish</span>
            </Button>
          </>
        )}
      </div>

      {/* Helper text */}
      <div className="text-sm text-text-tertiary font-medium">
        {isRecording && !isPaused && 'Speak clearly into your microphone'}
        {isPaused && 'Recording paused'}
        {!isRecording && !isProcessing && 'Press start when you are ready'}
        {isProcessing && 'Evaluating your answer...'}
      </div>
    </div>
  );
};

export default RecordingControls;
