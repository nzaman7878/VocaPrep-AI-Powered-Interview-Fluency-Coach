import { useState, useRef, useCallback, useEffect } from 'react';

const useAudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);

  const mediaRecorder = useRef(null);
  const mediaStream = useRef(null);
  const audioChunks = useRef([]);
  const timerInterval = useRef(null);

  // Timer logic for recording duration
  useEffect(() => {
    if (isRecording && !isPaused) {
      timerInterval.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerInterval.current);
    }

    return () => clearInterval(timerInterval.current);
  }, [isRecording, isPaused]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStream.current = stream;

      // Default to webm, as it's highly supported by MediaRecorder in modern browsers
      mediaRecorder.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      mediaRecorder.current.onstop = () => {
        const blob = new Blob(audioChunks.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        audioChunks.current = [];
      };

      mediaRecorder.current.start(200); // Emits dataavailable every 200ms
      setIsRecording(true);
      setIsPaused(false);
      setRecordingTime(0);
      setAudioBlob(null);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      throw err;
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      if (mediaStream.current) {
        mediaStream.current.getTracks().forEach((track) => track.stop());
      }
      setIsRecording(false);
      setIsPaused(false);
      clearInterval(timerInterval.current);
    }
  }, [isRecording]);

  const pauseRecording = useCallback(() => {
    if (mediaRecorder.current && isRecording && !isPaused) {
      mediaRecorder.current.pause();
      setIsPaused(true);
    }
  }, [isRecording, isPaused]);

  const resumeRecording = useCallback(() => {
    if (mediaRecorder.current && isRecording && isPaused) {
      mediaRecorder.current.resume();
      setIsPaused(false);
    }
  }, [isRecording, isPaused]);

  // Clean up on unmount just in case
  useEffect(() => {
    return () => {
      if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
        mediaRecorder.current.stop();
      }
      if (mediaStream.current) {
        mediaStream.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return {
    isRecording,
    isPaused,
    recordingTime,
    audioBlob,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
  };
};

export default useAudioRecorder;
