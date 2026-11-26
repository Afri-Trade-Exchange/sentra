import React from 'react';
import { motion } from 'framer-motion';
import { FaEye } from 'react-icons/fa';
import { Consignment, ConsignmentStatus } from './types';
import StatusDropdown from './StatusDropdown';

const ConsignmentCard: React.FC<{
  consignment: Consignment;
  onStatusChange: (id: string, status: ConsignmentStatus) => void;
  onViewDetails: (consignment: Consignment) => void;
  isSelected: boolean;
  onSelect: (id: string) => void;
}> = ({ consignment, onStatusChange, onViewDetails, isSelected, onSelect }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 rounded-2xl p-4 hover:shadow-md transition-shadow space-y-4 cursor-pointer ${
        isSelected ? 'ring-2 ring-teal-500' : ''
      }`}
      onClick={() => onSelect(consignment.id)}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-gray-800 dark:text-gray-100 text-lg">
            {consignment.traderName}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {consignment.documentType}
          </p>
        </div>

        <StatusDropdown
          currentStatus={consignment.status}
          onStatusChange={(newStatus) =>
            onStatusChange(consignment.id, newStatus)
          }
        />
      </div>

      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {consignment.createdAt.toDate().toLocaleDateString()}
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(consignment);
          }}
          className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 flex items-center font-medium"
        >
          <FaEye className="h-4 w-4 mr-1.5" />
          View Details
        </button>
      </div>
    </motion.div>
  );
};

export default ConsignmentCard;
