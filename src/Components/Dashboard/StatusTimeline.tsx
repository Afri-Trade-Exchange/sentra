import React from 'react';
import { motion } from 'framer-motion';
import { StatusUpdate } from '../../types/dashboard';
import { getStatusColor } from './dashboardUtils';

const StatusTimeline: React.FC<{ updates: StatusUpdate[] }> = ({ updates }) => {
  return (
    <div className="mt-4 space-y-3">
      {updates.map((update, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-3 text-sm"
        >
          <div className={`w-2 h-2 rounded-full ${getStatusColor(update.status)}`} />
          <span className="font-medium">{update.status}</span>
          <span className="text-gray-500">by {update.updatedBy}</span>
          <span className="text-gray-400">
            {update.timestamp.toLocaleString()}
          </span>
        </motion.div>
      ))}
    </div>
  );
};

export default StatusTimeline;
