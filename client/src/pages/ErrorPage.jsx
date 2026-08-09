import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import Button from '../components/ui/Button';
import useDocumentTitle from '../hooks/useDocumentTitle';

const ErrorPage = () => {
  useDocumentTitle('Something went wrong');
  const navigate = useNavigate();

  return (
    <PageLayout withSidebar={false}>
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8 relative"
        >
          <div className="absolute inset-0 bg-red-500/20 blur-3xl rounded-full" />
          <div className="relative bg-white p-6 rounded-3xl shadow-xl shadow-red-500/10 border border-slate-100">
            <AlertTriangle className="w-16 h-16 text-red-500" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl font-display font-bold text-slate-900 mb-4 tracking-tight"
        >
          Oops! Something went wrong
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-slate-500 max-w-md mx-auto mb-8 leading-relaxed"
        >
          We're sorry, but an unexpected error occurred. Please try refreshing the page or
          navigating back home.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            variant="outline"
            size="lg"
            onClick={() => window.location.reload()}
            className="flex items-center gap-2"
          >
            <RefreshCcw className="w-5 h-5" />
            Try Again
          </Button>

          <Link to="/">
            <Button
              size="lg"
              variant="primary"
              className="px-8 w-full sm:w-auto shadow-lg shadow-primary/20"
            >
              Return Home
            </Button>
          </Link>
        </motion.div>
      </div>
    </PageLayout>
  );
};

export default ErrorPage;
