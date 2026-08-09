import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageLayout from '../components/layout/PageLayout';
import SessionStatsCard from '../components/feedback/SessionStatsCard';
import FeedbackReport from '../components/feedback/FeedbackReport';
import { sessionApi } from '../api/sessionApi';
import Button from '../components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import useDocumentTitle from '../hooks/useDocumentTitle';

const SessionSummaryPage = () => {
  useDocumentTitle('Session Summary');

  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        setIsLoading(true);
        const response = await sessionApi.getSession(sessionId);
        setSession(response.data);
      } catch (err) {
        console.error('Failed to load session summary:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSession();
  }, [sessionId]);

  // Calculate aggregates
  const stats = React.useMemo(() => {
    if (!session || !session.questions) {
      return { completedQuestions: [], avgContentScore: 0, avgWpm: 0, totalQuestions: 0, durationMinutes: 0 };
    }
    const completedQuestions = session.questions.filter(
      (q) => q.transcript && q.contentScore !== undefined
    );
    const totalQuestions = completedQuestions.length;

    const avgContentScore =
      totalQuestions > 0
        ? completedQuestions.reduce((acc, q) => acc + (q.contentScore || 0), 0) / totalQuestions
        : 0;

    const avgWpm =
      totalQuestions > 0
        ? completedQuestions.reduce((acc, q) => acc + (q.deliveryMetrics?.wpm || 0), 0) /
          totalQuestions
        : 0;

    // Rough estimation of duration (assuming ~2 mins per question recorded)
    const durationMinutes = totalQuestions * 2;

    return {
      completedQuestions,
      avgContentScore,
      avgWpm,
      totalQuestions,
      durationMinutes,
    };
  }, [session]);

  if (isLoading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </PageLayout>
    );
  }

  if (!session) {
    return (
      <PageLayout>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-text-primary">Session not found</h2>
          <Button variant="secondary" className="mt-4" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </PageLayout>
    );
  }


  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-text-muted hover:text-primary transition-colors font-medium self-start md:self-auto"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </button>

          <div className="flex flex-col items-start md:items-end">
            <h1 className="text-2xl md:text-3xl font-bold text-text-primary font-display">
              Interview Summary
            </h1>
            <p className="text-text-muted">
              Role:{' '}
              <span className="font-semibold text-text-primary capitalize">{session.role}</span>
            </p>
          </div>
        </div>

        <div className="mb-12">
          <SessionStatsCard stats={stats} />
        </div>

        <div className="space-y-12">
          <h2 className="text-2xl font-bold text-text-primary font-display mb-6 border-b border-surface-elevated pb-4">
            Detailed Question Analysis
          </h2>

          {stats.completedQuestions.map((q, index) => (
            <motion.div
              key={q._id || index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-surface rounded-3xl p-8 border border-surface-elevated shadow-xl"
            >
              <div className="mb-6">
                <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-3">
                  Question {index + 1} • {q.questionType}
                </span>
                <h3 className="text-xl font-bold text-text-primary mb-4">{q.questionText}</h3>

                <div className="bg-background p-5 rounded-2xl border border-surface-elevated">
                  <h4 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-2">
                    Your Answer
                  </h4>
                  <p className="text-text-primary italic leading-relaxed">"{q.transcript}"</p>
                </div>
              </div>

              <FeedbackReport
                evaluationResult={{
                  contentEvaluation: q.contentFeedback,
                  deliveryEvaluation: q.deliveryFeedback,
                  coachingReport: q.feedback,
                }}
              />
            </motion.div>
          ))}

          {stats.completedQuestions.length === 0 && (
            <div className="text-center py-10 bg-surface rounded-2xl border border-surface-elevated">
              <p className="text-text-muted font-medium">
                No completed questions found for this session.
              </p>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default SessionSummaryPage;
