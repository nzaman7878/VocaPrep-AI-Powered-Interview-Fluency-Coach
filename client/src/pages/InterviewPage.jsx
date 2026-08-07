import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import PageLayout from '../components/layout/PageLayout';
import QuestionCard from '../components/interview/QuestionCard';
import { sessionApi } from '../api/sessionApi';
import { questionApi } from '../api/questionApi';
import { startInterview, setAttemptData } from '../store/slices/interviewSlice';
import Button from '../components/ui/Button';

const InterviewPage = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    sessionId: stateSessionId,
    role,
    questions,
    currentQuestionIndex,
    status,
  } = useSelector((state) => state.interview);

  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentQuestionData, setCurrentQuestionData] = useState(null);

  // Hydrate state if arriving directly via URL
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

  // Handle Question Generation
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

  useEffect(() => {
    // If we've loaded the session and don't have the question loaded yet, generate it
    if (!isLoading && !isGenerating && !currentQuestionData) {
      // Check if it already exists in the backend questions array
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

  const handleTimeUp = () => {
    console.log('Time is up for this question!');
    // Later we will trigger auto-recording stop here
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

  return (
    <PageLayout>
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-8">
          <QuestionCard
            question={currentQuestionData}
            index={currentQuestionIndex}
            total={Math.max(questions.length, 5)} // default 5 if not loaded
            isActive={status !== 'processing' && status !== 'completed'}
            isLoading={isGenerating}
            onTimeUp={handleTimeUp}
          />
        </div>

        {/* Temporary Placeholder for Recording Controls (Module 81/82) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl shadow-slate-100/50 flex flex-col items-center justify-center min-h-[300px]"
        >
          <div className="text-slate-400 text-center mb-6">
            <svg
              className="w-16 h-16 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
              />
            </svg>
            <h3 className="text-xl font-bold text-slate-700 mb-2 font-display">
              Audio Recording Component
            </h3>
            <p>Will be implemented in the next modules.</p>
          </div>

          {/* Temporary skip button just to test flow */}
          <Button variant="secondary" onClick={fetchNextQuestion} disabled={isGenerating}>
            Simulate Next Question
          </Button>
        </motion.div>
      </div>
    </PageLayout>
  );
};

export default InterviewPage;
