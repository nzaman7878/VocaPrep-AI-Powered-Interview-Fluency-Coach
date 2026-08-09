import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import PageLayout from '../components/layout/PageLayout';
import QuestionCard from '../components/interview/QuestionCard';
import RecordingControls from '../components/interview/RecordingControls';
import useAudioRecorder from '../hooks/useAudioRecorder';
import useSessionPersistence from '../hooks/useSessionPersistence';
import { questionApi } from '../api/questionApi';
import { interviewApi } from '../api/interviewApi';
import { startInterview, completeQuestion } from '../store/slices/interviewSlice';
import Button from '../components/ui/Button';
import FeedbackReport from '../components/feedback/FeedbackReport';
import ProcessingOverlay from '../components/interview/ProcessingOverlay';
import ErrorMessage from '../components/ui/ErrorMessage';
import useDocumentTitle from '../hooks/useDocumentTitle';

// State Machine Steps
const FLOW_STATES = {
  IDLE: 'IDLE',
  RECORDING: 'RECORDING',
  UPLOADING: 'UPLOADING',
  TRANSCRIBING: 'TRANSCRIBING',
  EVALUATING: 'EVALUATING',
  SHOWING_FEEDBACK: 'SHOWING_FEEDBACK',
  ERROR: 'ERROR',
};

const InterviewPage = () => {
  useDocumentTitle('Interview Session');

  const { sessionId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isRestoring, error: sessionError } = useSessionPersistence(sessionId);

  const {
    sessionId: stateSessionId,
    role,
    questions,
    totalQuestions,
    currentQuestionIndex,
    status,
  } = useSelector((state) => state.interview);

  const [isGenerating, setIsGenerating] = useState(false);
  const [currentQuestionData, setCurrentQuestionData] = useState(null);

  const [flowState, setFlowState] = useState(FLOW_STATES.IDLE);
  const [evaluationResult, setEvaluationResult] = useState(null);

  const {
    isRecording,
    isPaused,
    recordingTime,
    audioBlob,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
  } = useAudioRecorder();

  // Redirect on error
  useEffect(() => {
    if (sessionError) {
      navigate('/role-selection');
    }
  }, [sessionError, navigate]);

  // Navigate to summary when interview is complete
  useEffect(() => {
    if (status === 'completed') {
      navigate(`/summary/${sessionId}`);
    }
  }, [status, navigate, sessionId]);

  // Generate the next question using LangGraph pipeline
  const fetchNextQuestion = useCallback(async () => {
    if (!sessionId || !role || isGenerating) return;

    setIsGenerating(true);
    try {
      const qType = currentQuestionIndex % 2 === 0 ? 'behavioral' : 'technical';
      const response = await questionApi.generateQuestion(sessionId, role, qType);

      setCurrentQuestionData({
        text: response.data.questionText,
        type: qType,
      });
    } catch (err) {
      console.error('Failed to generate question:', err);
      // Fallback
      setCurrentQuestionData({
        text: 'Could you tell me about a time you had to overcome a difficult challenge?',
        type: 'behavioral',
      });
    } finally {
      setIsGenerating(false);
    }
  }, [sessionId, role, currentQuestionIndex, isGenerating]);

  // Ensure we have a question generated
  useEffect(() => {
    if (!isRestoring && !isGenerating && !currentQuestionData) {
      const existingQuestion = questions[currentQuestionIndex];
      if (existingQuestion && existingQuestion.text) {
        setCurrentQuestionData({
          text: existingQuestion.text,
          type: existingQuestion.type || 'behavioral',
        });
      } else {
        fetchNextQuestion();
      }
    }
  }, [
    isRestoring,
    isGenerating,
    currentQuestionData,
    currentQuestionIndex,
    questions,
    fetchNextQuestion,
  ]);

  // Handle start recording
  const handleStartRecording = useCallback(() => {
    setFlowState(FLOW_STATES.RECORDING);
    startRecording();
  }, [startRecording]);

  // Handle auto-stop on time up
  const handleTimeUp = useCallback(() => {
    if (isRecording) {
      stopRecording();
    }
  }, [isRecording, stopRecording]);

  // Main Processing Pipeline (Upload -> Transcribe -> Evaluate)
  useEffect(() => {
    const processAudio = async () => {
      if (!audioBlob || flowState !== FLOW_STATES.RECORDING) return;

      try {
        const finalEvaluation = await interviewApi.processAnswerPipeline(
          sessionId,
          audioBlob,
          currentQuestionData,
          (stepState) => setFlowState(FLOW_STATES[stepState])
        );

        setEvaluationResult(finalEvaluation);

        // 5. Complete
        setFlowState(FLOW_STATES.SHOWING_FEEDBACK);
      } catch (err) {
        console.error('Pipeline error:', err);
        setFlowState(FLOW_STATES.ERROR);
      }
    };

    processAudio();
  }, [audioBlob, flowState, sessionId, currentQuestionData]);

  const handleRetryProcessing = useCallback(() => {
    // Re-trigger the processing pipeline
    setFlowState(FLOW_STATES.RECORDING);
  }, []);

  const handleNextQuestion = useCallback(async () => {
    const isLastQuestion = currentQuestionIndex >= (totalQuestions || 5) - 1;

    dispatch(completeQuestion());

    if (isLastQuestion) {
      try {
        // Must notify backend to finalize the session and generate the ProgressSnapshot
        await sessionApi.completeSession(sessionId);
      } catch (err) {
        console.error('Failed to complete session on backend:', err);
      }
    } else {
      setFlowState(FLOW_STATES.IDLE);
      setCurrentQuestionData(null); // will trigger fetchNextQuestion
      setEvaluationResult(null);
    }
  }, [dispatch, currentQuestionIndex, totalQuestions, sessionId]);

  if (isRestoring) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </PageLayout>
    );
  }

  const isProcessing = [
    FLOW_STATES.UPLOADING,
    FLOW_STATES.TRANSCRIBING,
    FLOW_STATES.EVALUATING,
  ].includes(flowState);

  return (
    <PageLayout>
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-8">
          <QuestionCard
            question={currentQuestionData}
            index={currentQuestionIndex}
            total={totalQuestions || 5}
            isActive={flowState === FLOW_STATES.RECORDING}
            isLoading={isGenerating}
            onTimeUp={handleTimeUp}
          />
        </div>

        <AnimatePresence mode="wait">
          {flowState === FLOW_STATES.SHOWING_FEEDBACK ? (
            <motion.div
              key="feedback"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col gap-6"
            >
              <div className="bg-surface rounded-3xl p-6 border border-surface-elevated shadow-xl">
                <h3 className="text-xl font-bold text-text-primary mb-2 font-display">
                  Your Transcript
                </h3>
                <p className="text-text-muted leading-relaxed italic">
                  "{evaluationResult?.transcript}"
                </p>
              </div>

              <FeedbackReport evaluationResult={evaluationResult} />

              <div className="flex justify-end mt-2">
                <Button size="lg" onClick={handleNextQuestion}>
                  Continue to Next Question
                </Button>
              </div>
            </motion.div>
          ) : flowState === FLOW_STATES.ERROR ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="py-12"
            >
              <ErrorMessage
                title="Processing Failed"
                message="We encountered an issue while analyzing your answer. Please try processing it again."
                onRetry={handleRetryProcessing}
              />
            </motion.div>
          ) : isProcessing ? (
            <ProcessingOverlay key="processing" flowState={flowState} />
          ) : (
            <motion.div
              key="controls"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <RecordingControls
                isRecording={isRecording}
                isPaused={isPaused}
                recordingTime={recordingTime}
                onStart={handleStartRecording}
                onStop={stopRecording}
                onPause={pauseRecording}
                onResume={resumeRecording}
                isProcessing={isProcessing}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageLayout>
  );
};

export default InterviewPage;
