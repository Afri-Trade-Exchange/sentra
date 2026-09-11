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
      className={`bg-white shadow-sm rounded-lg p-4 hover:shadow-md transition-shadow space-y-4 ${
        isSelected ? 'ring-2 ring-teal-500' : ''
      }`}
      onClick={() => onSelect(consignment.id)}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-gray-800 text-lg">
            {consignment.traderName}
          </h3>
          <p className="text-sm text-gray-500">
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
        <span className="text-sm text-gray-500">
          {consignment.uploadDate.toDate().toLocaleDateString()}
        </span>
        <button
          type="button"
          onClick={() => onViewDetails(consignment)}
          className="text-teal-600 hover:text-teal-700 flex items-center"
        >
          <FaEye className="h-5 w-5 mr-1 border-radius-15" />
          View Details
        </button>
      </div>
    </motion.div>
  );
};

export default ConsignmentCard;
