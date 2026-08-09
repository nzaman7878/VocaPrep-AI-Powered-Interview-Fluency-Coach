import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';
import StatsOverview from '../components/dashboard/StatsOverview';
import WpmTrendChart from '../components/dashboard/WpmTrendChart';
import FillerRateTrendChart from '../components/dashboard/FillerRateTrendChart';
import ContentScoreTrendChart from '../components/dashboard/ContentScoreTrendChart';
import SessionHistoryList from '../components/dashboard/SessionHistoryList';
import WeakAreasCard from '../components/dashboard/WeakAreasCard';
import { progressApi } from '../api/progressApi';
import { sessionApi } from '../api/sessionApi';
import {
  setProgressLoading,
  setProgressData,
  setProgressError,
} from '../store/slices/progressSlice';
import useRetry from '../hooks/useRetry';
import ErrorMessage from '../components/ui/ErrorMessage';
import useDocumentTitle from '../hooks/useDocumentTitle';

const DashboardPage = () => {
  useDocumentTitle('Progress Dashboard');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const { totalSessions, averageScore, totalPracticeTimeSeconds, history, isLoading, error } =
    useSelector((state) => state.progress);

  const [sessions, setSessions] = useState([]);

  // Fetch data
  const fetchDataFn = useCallback(async () => { console.log('fetchDataFn running');
    dispatch(setProgressLoading());

    const [summaryData, snapshotsData, sessionsData] = await Promise.all([
      progressApi.getProgressSummary(),
      progressApi.getProgressSnapshots({ limit: 50 }),
      sessionApi.getSessions({ limit: 100 }), // fetch all for pagination on client side
    ]);

    const summary = summaryData.data || summaryData;
    const historyList = snapshotsData.data || snapshotsData;
    const sessionList = sessionsData.data?.sessions || [];

    dispatch(
      setProgressData({
        totalSessions: summary.totalSessions || 0,
        averageScore: summary.avgContentScore || 0,
        totalPracticeTimeSeconds: 0,
        history: historyList.map((snap, i) => ({
          name: `S${i + 1}`,
          wpm: snap.avgWpm || 0,
          fillerCount: snap.avgFillerRate || 0, // Using rate as count for demo
          contentScore: snap.avgContentScore || 0,
        })),
      })
    );

    // Enrich sessions with their computed content scores if completed
    const enrichedSessions = sessionList.map((session) => {
      const snap = historyList.find((h) => h.sessionId === session._id);
      if (snap) {
        return { ...session, averageContentScore: Math.round(snap.avgContentScore) || 0 };
      }
      return session;
    });

    setSessions(enrichedSessions);
  }, [dispatch]);

  const {
    execute: fetchDashboardData,
    error: retryError,
    isLoading: isFetching,
  } = useRetry(fetchDataFn);

  useEffect(() => { console.log('useEffect running');
    // Navigate check removed because ProtectedRoute handles it
    fetchDashboardData();
  }, [fetchDashboardData]);

  const bestScore = React.useMemo(() => {
    return history.length > 0 ? Math.max(...history.map((h) => h.contentScore)) : 0;
  }, [history]);

  const avgWpm = React.useMemo(() => {
    return history.length > 0 ? history.reduce((sum, h) => sum + h.wpm, 0) / history.length : 0;
  }, [history]);

  if (isFetching || isLoading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </PageLayout>
    );
  }

  if (retryError || error) {
    return (
      <PageLayout>
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <ErrorMessage
            message="Failed to load dashboard data."
            error={retryError || error}
            onRetry={fetchDashboardData}
          />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-text-primary font-display tracking-tight mb-2">
              Your Progress Dashboard
            </h1>
            <p className="text-text-muted text-lg">
              Track your interview fluency and improvement over time.
            </p>
          </div>
          <button
            onClick={() => navigate('/role-selection')}
            className="inline-flex items-center justify-center bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-hover transition-colors shadow-md shadow-primary/20"
          >
            Start New Interview
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>

        <div className="mb-8">
          <StatsOverview
            totalSessions={totalSessions}
            averageWpm={Math.round(avgWpm)}
            bestContentScore={Math.round(bestScore)}
            improvement={0} // Can implement actual improvement calculation later
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ContentScoreTrendChart data={history} />
              <WpmTrendChart data={history} />
            </div>
            <FillerRateTrendChart data={history} />
          </div>
          <div className="lg:col-span-1">
            <WeakAreasCard weakAreas={[]} /> {/* Empty for now until frontend fetches RAG data */}
          </div>
        </div>

        <div>
          <SessionHistoryList sessions={sessions} />
        </div>
      </div>
    </PageLayout>
  );
};

export default DashboardPage;
