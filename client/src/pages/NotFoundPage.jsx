import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import Button from '../components/ui/Button';
import useDocumentTitle from '../hooks/useDocumentTitle';

const NotFoundPage = () => {
  useDocumentTitle('Page Not Found');

  return (
    <PageLayout withSidebar={false}>
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8 relative"
        >
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
          <div className="relative bg-white p-6 rounded-3xl shadow-xl shadow-primary/10 border border-slate-100">
            <Search className="w-16 h-16 text-primary" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-6xl font-display font-bold text-slate-900 mb-4 tracking-tight"
        >
          404
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-2xl font-semibold text-slate-700 mb-4"
        >
          Page not found
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-slate-500 max-w-md mx-auto mb-8 leading-relaxed"
        >
          Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link to="/">
            <Button size="lg" className="px-8 shadow-lg shadow-primary/20 hover:shadow-primary/30">
              Return Home
            </Button>
          </Link>
        </motion.div>
      </div>
    </PageLayout>
  );
};

export default NotFoundPage;
