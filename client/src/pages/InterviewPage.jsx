import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import PageLayout from '../components/layout/PageLayout';
import QuestionCard from '../components/interview/QuestionCard';
import RecordingControls from '../components/interview/RecordingControls';
import useAudioRecorder from '../hooks/useAudioRecorder';
import { sessionApi } from '../api/sessionApi';
import { questionApi } from '../api/questionApi';
import { uploadAudio } from '../api/audioApi';
import { transcribeAudio } from '../api/transcriptionApi';
import { evaluationApi } from '../api/evaluationApi';
import { startInterview, completeQuestion } from '../store/slices/interviewSlice';
import Button from '../components/ui/Button';
import FeedbackReport from '../components/feedback/FeedbackReport';

// State Machine Steps
const FLOW_STATES = {
  IDLE: 'IDLE',
  RECORDING: 'RECORDING',
  UPLOADING: 'UPLOADING',
  TRANSCRIBING: 'TRANSCRIBING',
  EVALUATING: 'EVALUATING',
  SHOWING_FEEDBACK: 'SHOWING_FEEDBACK',
};

const InterviewPage = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    sessionId: stateSessionId,
    role,
    questions,
    currentQuestionIndex,
  } = useSelector((state) => state.interview);

  const [isLoading, setIsLoading] = useState(true);
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

  // Hydrate session if accessed directly via URL
  useEffect(() => {
    const fetchSession = async () => {
      try {
        if (!stateSessionId || stateSessionId !== sessionId) {
          setIsLoading(true);
          const response = await sessionApi.getSession(sessionId);
          dispatch(
            startInterview({
              sessionId: response.data._id,
              role: response.data.role,
              questions: response.data.questions || [],
            })
          );
        } else {
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Failed to load session:', err);
        navigate('/role-selection');
      }
    };

    fetchSession();
  }, [sessionId, stateSessionId, dispatch, navigate]);

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
    if (!isLoading && !isGenerating && !currentQuestionData) {
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
    isLoading,
    isGenerating,
    currentQuestionData,
    currentQuestionIndex,
    questions,
    fetchNextQuestion,
  ]);

  // Handle start recording
  const handleStartRecording = () => {
    setFlowState(FLOW_STATES.RECORDING);
    startRecording();
  };

  // Handle auto-stop on time up
  const handleTimeUp = () => {
    if (isRecording) {
      stopRecording();
    }
  };

  // Main Processing Pipeline (Upload -> Transcribe -> Evaluate)
  useEffect(() => {
    const processAudio = async () => {
      if (!audioBlob || flowState !== FLOW_STATES.RECORDING) return;

      try {
        // 1. Upload Audio
        setFlowState(FLOW_STATES.UPLOADING);
        const uploadResult = await uploadAudio(audioBlob, (progressEvent) => {
          // progress tracking could go here
        });

        // 2. Transcribe Audio via AssemblyAI
        setFlowState(FLOW_STATES.TRANSCRIBING);
        const transcriptionResult = await transcribeAudio(uploadResult.secure_url);

        // 3. Save Attempt to Database
        // We must do this *before* evaluation to get an attempt ID
        const attemptResponse = await questionApi.addQuestionAttempt(sessionId, {
          questionText: currentQuestionData.text,
          questionType: currentQuestionData.type,
          transcript: transcriptionResult.text,
          audioUrl: uploadResult.secure_url,
        });

        const attemptId = attemptResponse.data._id;

        // 4. Run LangGraph Evaluation Pipeline
        setFlowState(FLOW_STATES.EVALUATING);
        const evalResponse = await evaluationApi.evaluateAnswer(
          sessionId,
          attemptId,
          transcriptionResult.text,
          transcriptionResult.words
        );

        setEvaluationResult({
          transcript: transcriptionResult.text,
          ...evalResponse.data,
        });

        // 5. Complete
        setFlowState(FLOW_STATES.SHOWING_FEEDBACK);
      } catch (err) {
        console.error('Pipeline error:', err);
        alert('Something went wrong during processing. Please try again.');
        setFlowState(FLOW_STATES.IDLE);
      }
    };

    processAudio();
  }, [audioBlob, flowState, sessionId, currentQuestionData]);

  const handleNextQuestion = () => {
    dispatch(completeQuestion());
    setFlowState(FLOW_STATES.IDLE);
    setCurrentQuestionData(null); // will trigger fetchNextQuestion
    setEvaluationResult(null);
  };

  if (isLoading) {
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
            total={Math.max(questions.length, 5)}
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
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl shadow-slate-100/50">
                <h3 className="text-xl font-bold text-slate-800 mb-2 font-display">
                  Your Transcript
                </h3>
                <p className="text-slate-600 leading-relaxed italic">
                  "{evaluationResult?.transcript}"
                </p>
              </div>

              <FeedbackReport evaluationResult={evaluationResult} />

              <div className="flex justify-end mt-2">
                <Button
                  size="lg"
                  onClick={handleNextQuestion}
                  className="shadow-lg shadow-indigo-200"
                >
                  Continue to Next Question
                </Button>
              </div>
            </motion.div>
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

              {isProcessing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-6 text-center text-slate-500 font-medium"
                >
                  {flowState === FLOW_STATES.UPLOADING && 'Uploading audio securely...'}
                  {flowState === FLOW_STATES.TRANSCRIBING && 'Transcribing your answer...'}
                  {flowState === FLOW_STATES.EVALUATING && 'AI evaluating content and delivery...'}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageLayout>
  );
};

export default InterviewPage;
