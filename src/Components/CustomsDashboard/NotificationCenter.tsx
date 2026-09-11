import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FaBell, FaClock } from 'react-icons/fa';
import { NotificationType } from './types';

const NotificationCenter: React.FC<{ notifications: NotificationType[] }> = ({ notifications }) => {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-3 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
      >
        <FaBell className="w-6 h-6 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full right-0 mb-2 w-80 bg-white rounded-lg shadow-xl"
          >
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-semibold">Notifications</h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 ${
                    !notification.read ? 'bg-teal-50' : ''
                  }`}
                >
                  <p className="text-sm text-gray-900">{notification.message}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <FaClock className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500">
                      {new Date(notification.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationCenter;
