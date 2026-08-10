import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';

const ITEMS_PER_PAGE = 5;

const SessionHistoryList = ({ sessions = [] }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  if (!sessions || sessions.length === 0) {
    return (
      <div className="glass-panel rounded-3xl p-8 text-center">
        <div className="w-16 h-16 bg-surface-elevated rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-text-muted"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-text-primary mb-2">No Past Sessions</h3>
        <p className="text-text-muted mb-6">You haven't completed any interviews yet.</p>
        <Button onClick={() => navigate('/role-selection')} variant="primary">
          Start an Interview
        </Button>
      </div>
    );
  }

  const totalPages = Math.ceil(sessions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedSessions = sessions.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="glass-panel rounded-3xl overflow-hidden flex flex-col">
      <div className="p-6 border-b border-surface-elevated flex justify-between items-center bg-surface/50">
        <h3 className="text-xl font-bold text-text-primary font-display">Recent Interviews</h3>
        <span className="text-sm font-medium text-text-muted bg-surface-elevated px-3 py-1 rounded-full border border-surface-elevated">
          {sessions.length} Total
        </span>
      </div>

      <div className="divide-y divide-surface-elevated flex-1">
        {paginatedSessions.map((session) => (
          <div
            key={session._id}
            className="p-6 hover:bg-surface-elevated/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 group"
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h4 className="font-bold text-text-primary text-lg capitalize group-hover:text-primary transition-colors">
                  {session.role.replace('-', ' ')}
                </h4>
                {session.status === 'completed' ? (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                    Completed
                  </span>
                ) : (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20">
                    Incomplete
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm text-text-muted">
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {formatDate(session.createdAt || new Date())}
                </div>
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  {session.questions?.length || 0} / {session.totalQuestions || 5} Questions
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              {session.status === 'completed' && session.averageContentScore && (
                <div className="text-center">
                  <div className="text-2xl font-black text-primary">
                    {session.averageContentScore}
                  </div>
                  <div className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                    Avg Score
                  </div>
                </div>
              )}
              <button
                onClick={() => navigate(`/summary/${session._id}`)}
                className="flex items-center gap-2 text-primary font-semibold hover:text-primary-hover transition-colors"
              >
                View
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="p-4 border-t border-surface-elevated flex items-center justify-between bg-surface/50">
          <p className="text-sm text-text-muted font-medium ml-2">
            Showing <span className="text-text-primary">{startIndex + 1}</span> to{' '}
            <span className="text-text-primary">
              {Math.min(startIndex + ITEMS_PER_PAGE, sessions.length)}
            </span>{' '}
            of <span className="text-text-primary">{sessions.length}</span>
          </p>
          <div className="flex gap-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-surface-elevated text-text-primary hover:bg-surface-elevated disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-surface shadow-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-surface-elevated text-text-primary hover:bg-surface-elevated disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-surface shadow-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionHistoryList;
