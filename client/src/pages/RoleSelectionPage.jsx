import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { ROLES } from '../../../shared/roles';
import RoleCard from '../components/interview/RoleCard';
import Button from '../components/ui/Button';
import PageLayout from '../components/layout/PageLayout';
import { sessionApi } from '../api/sessionApi';
import { startInterview } from '../store/slices/interviewSlice';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

const RoleSelectionPage = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [questionCount, setQuestionCount] = useState(5);
  const [isStarting, setIsStarting] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleStart = async () => {
    if (!selectedRole) return;

    setIsStarting(true);
    try {
      // Create session in backend
      const response = await sessionApi.createSession(selectedRole.id, questionCount);

      // Initialize Redux state
      dispatch(
        startInterview({
          sessionId: response.data._id,
          role: selectedRole.id,
          questions: response.data.questions || [],
        })
      );

      // Navigate to interview room
      navigate(`/interview/${response.data._id}`);
    } catch (error) {
      console.error('Failed to start interview:', error);
      alert('Failed to start interview session. Please try again.');
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        <div className="mb-12 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 font-display tracking-tight">
              Configure Your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                Interview Room
              </span>
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed">
              Select the role you're targeting. Our AI will dynamically generate rigorous,
              context-aware questions tailored to your selection and adapt to your performance as
              you speak.
            </p>
          </motion.div>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {ROLES.map((role) => (
            <motion.div key={role.id} variants={itemVariants} className="h-full">
              <RoleCard
                role={role}
                isSelected={selectedRole?.id === role.id}
                onClick={setSelectedRole}
              />
            </motion.div>
          ))}
        </motion.div>

        {selectedRole && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row items-center justify-between p-8 bg-white border border-slate-200 rounded-3xl shadow-xl shadow-slate-100/50"
          >
            <div className="mb-6 sm:mb-0">
              <h4 className="text-lg font-bold text-slate-800 mb-1">Session Settings</h4>
              <p className="text-sm text-slate-500">Configure your specific parameters.</p>
            </div>

            <div className="flex flex-col sm:flex-row w-full sm:w-auto items-stretch sm:items-center gap-4 sm:gap-6">
              <div className="flex items-center justify-between sm:justify-start gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                <span className="text-sm font-medium text-slate-700 pl-2">Questions:</span>
                <div className="flex bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
                  {[3, 5, 7].map((num) => (
                    <button
                      key={num}
                      onClick={() => setQuestionCount(num)}
                      className={`px-4 py-2 text-sm font-bold transition-colors ${
                        questionCount === num
                          ? 'bg-indigo-600 text-white'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleStart}
                isLoading={isStarting}
                disabled={!selectedRole || isStarting}
                size="lg"
                className="w-full sm:w-auto px-10 shadow-lg shadow-indigo-200"
              >
                Launch Interview
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </PageLayout>
  );
};

export default RoleSelectionPage;
