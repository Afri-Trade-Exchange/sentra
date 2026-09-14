import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FaChevronDown } from 'react-icons/fa';
import { ConsignmentStatus } from './types';
import { STATUS_CONFIG } from './statusConfig';

const StatusDropdown: React.FC<{
  currentStatus: ConsignmentStatus;
  onStatusChange: (newStatus: ConsignmentStatus) => void;
}> = ({ currentStatus, onStatusChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const statusOptions = Object.values(ConsignmentStatus)
    .filter(status => status !== currentStatus);

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className={`
            inline-flex justify-center w-full px-4 py-2 text-sm font-medium
            rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75
            ${STATUS_CONFIG[currentStatus].color}
            ${STATUS_CONFIG[currentStatus].bgColor}
          `}
        >
          <div className="flex items-center">
            {React.createElement(STATUS_CONFIG[currentStatus].icon, {
              className: "mr-2 h-5 w-5"
            })}
            {currentStatus}
            <FaChevronDown className="ml-2 -mr-1 h-4 w-4" />
          </div>
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute z-10 w-full mt-2 origin-top-right bg-white dark:bg-gray-800
              rounded-xl shadow-lg ring-1 ring-black dark:ring-white/10 ring-opacity-5 focus:outline-none"
          >
            <div className="py-1">
              {statusOptions.map((status) => (
                <button
                  type="button"
                  key={status}
                  onClick={(e) => {
                    e.stopPropagation();
                    onStatusChange(status);
                    setIsOpen(false);
                  }}
                  className={`
                    group flex items-center w-full px-4 py-2 text-sm
                    hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors
                    ${STATUS_CONFIG[status].color}
                  `}
                >
                  {React.createElement(STATUS_CONFIG[status].icon, {
                    className: "mr-3 h-5 w-5"
                  })}
                  {status}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StatusDropdown;
