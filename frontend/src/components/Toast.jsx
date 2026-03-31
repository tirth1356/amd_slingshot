import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Toast({ message, type = 'success', onClose }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 400); // Allow animation to complete
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const config = {
    success: { icon: CheckCircle, class: 'bg-accent/20 border-accent/40 text-accent' },
    error:   { icon: AlertCircle, class: 'bg-danger/20 border-danger/40 text-danger' },
    warning: { icon: AlertCircle, class: 'bg-warning/20 border-warning/40 text-warning' }
  };

  const { icon: Icon, class: themeClass } = config[type];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className={`fixed bottom-6 right-6 z-[9999] flex items-center gap-4 px-5 py-4 border rounded-2xl glass shadow-2xl backdrop-blur-2xl ${themeClass}`}
        >
          <Icon className="w-6 h-6" />
          <p className="font-semibold text-sm mr-4">{message}</p>
          <button onClick={() => setIsVisible(false)} className="hover:opacity-60 transition-opacity">
            <X className="w-5 h-5 px-1" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
