import React, { createContext, useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import Toast from '../components/ui/Toast';

export const ToastContext = createContext(null);

let idCounter = 0;

const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed bottom-20 right-4 md:bottom-4 md:right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} removeToast={removeToast} />
        ))}
      </AnimatePresence>
    </div>
  );
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = ++idCounter;
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};
