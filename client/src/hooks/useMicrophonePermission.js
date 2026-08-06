import { useState, useCallback, useEffect } from 'react';

const useMicrophonePermission = () => {
  const [permissionState, setPermissionState] = useState('prompt'); // 'prompt', 'granted', 'denied'
  const [error, setError] = useState(null);
  const [isSupported, setIsSupported] = useState(() => {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  });

  // Set initial error if not supported
  useEffect(() => {
    if (!isSupported) {
      setError('Microphone is not supported in this browser.');
    }
  }, [isSupported]);

  const checkPermission = useCallback(async () => {
    if (!isSupported) return;

    try {
      // Use the Permissions API if available to check state without prompting
      if (navigator.permissions && navigator.permissions.query) {
        const result = await navigator.permissions.query({ name: 'microphone' });
        setPermissionState(result.state);

        // Listen for user changing permission in browser settings
        result.onchange = () => {
          setPermissionState(result.state);
        };
      }
    } catch (err) {
      // Permissions API might not be supported for microphone in all browsers (like Firefox or older Safari)
      console.warn(
        'Permissions API not fully supported for microphone, relying on getUserMedia fallback.'
      );
    }
  }, [isSupported]);

  // Initial check on mount
  useEffect(() => {
    // eslint-disable-next-line
    checkPermission();
  }, [checkPermission]);

  const requestPermission = useCallback(async () => {
    if (!isSupported) return false;

    setError(null);
    try {
      // Request access. If granted, it resolves with a stream.
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Immediately stop the tracks so we don't leave the microphone actively recording
      stream.getTracks().forEach((track) => track.stop());

      setPermissionState('granted');
      return true;
    } catch (err) {
      setPermissionState('denied');

      // Handle specific error types
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError('Microphone access was denied. Please enable it in your browser settings.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setError('No microphone found on this device.');
      } else {
        setError('An error occurred while accessing the microphone: ' + err.message);
      }
      return false;
    }
  }, [isSupported]);

  return {
    permissionState,
    isGranted: permissionState === 'granted',
    isDenied: permissionState === 'denied',
    isSupported,
    error,
    requestPermission,
    checkPermission,
  };
};

export default useMicrophonePermission;
