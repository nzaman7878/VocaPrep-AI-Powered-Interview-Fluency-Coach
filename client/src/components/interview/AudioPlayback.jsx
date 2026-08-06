import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import TranscriptDisplay from './TranscriptDisplay';

const formatTime = (seconds) => {
  if (isNaN(seconds)) return '00:00';
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0');
  return `${m}:${s}`;
};

const AudioPlayback = ({ audioUrl, words = [] }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      // audio.currentTime is in seconds, TranscriptDisplay expects milliseconds
      setCurrentTime(audioRef.current.currentTime * 1000);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  const reset = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      if (!isPlaying) {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleSeek = (e) => {
    if (!audioRef.current || duration === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickPos = (e.clientX - rect.left) / rect.width;
    const newTimeSec = clickPos * duration;

    audioRef.current.currentTime = newTimeSec;
    setCurrentTime(newTimeSec * 1000);
  };

  return (
    <div className="flex flex-col space-y-6">
      {/* Hidden native audio element */}
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        className="hidden"
      />

      {/* Custom Audio Control Deck */}
      <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 p-5 bg-surface-50 dark:bg-surface-800/50 rounded-2xl border border-border-light dark:border-border-dark shadow-sm">
        {/* Play/Pause & Reset */}
        <div className="flex items-center space-x-3">
          <button
            onClick={togglePlay}
            className="flex items-center justify-center w-12 h-12 bg-primary-500 hover:bg-primary-600 text-white rounded-full transition-transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 ml-1 fill-current" />
            )}
          </button>

          <button
            onClick={reset}
            className="p-2.5 text-text-tertiary hover:text-text-primary hover:bg-surface-200 dark:hover:bg-surface-700 rounded-full transition-colors"
            title="Restart playback"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        {/* Scrubber / Progress Bar */}
        <div className="flex-1 w-full flex items-center space-x-3">
          <span className="text-xs font-mono text-text-tertiary w-10 text-right">
            {formatTime(currentTime / 1000)}
          </span>

          <div
            className="flex-1 relative h-3 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden cursor-pointer group"
            onClick={handleSeek}
          >
            <div
              className="absolute top-0 left-0 h-full bg-primary-500 rounded-full transition-all duration-75 group-hover:bg-primary-400"
              style={{ width: duration > 0 ? `${(currentTime / 1000 / duration) * 100}%` : '0%' }}
            />
          </div>

          <span className="text-xs font-mono text-text-tertiary w-10">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Synchronized Transcript */}
      {words && words.length > 0 ? (
        <div>
          <h4 className="text-sm font-semibold tracking-wide text-text-secondary uppercase mb-3 px-1">
            Playback Transcript
          </h4>
          <TranscriptDisplay words={words} playbackTime={currentTime} autoPlay={false} />
        </div>
      ) : (
        <div className="p-8 text-center text-text-tertiary italic bg-surface-50 dark:bg-surface-900 rounded-xl border border-dashed border-border-light dark:border-border-dark">
          No transcript available for this audio.
        </div>
      )}
    </div>
  );
};

export default AudioPlayback;
