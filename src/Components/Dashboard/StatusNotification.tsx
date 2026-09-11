import React from 'react';
import { motion } from 'framer-motion';

const StatusNotification: React.FC<{ message: string | null }> = ({ message }) => {
  if (!message) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed bottom-4 right-4 bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg"
    >
      {message}
    </motion.div>
  );
};

export default StatusNotification;
