import React from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { ConsignmentStatus } from './types';

const StatusFilterDropdown: React.FC<{
  statusFilter: ConsignmentStatus | null;
  onStatusFilterChange: (value: ConsignmentStatus | null) => void;
}> = ({ statusFilter, onStatusFilterChange }) => {
  return (
    <div className="relative">
      <select
        value={statusFilter || ''}
        onChange={(e) => onStatusFilterChange(e.target.value as ConsignmentStatus | null)}
        aria-label="Filter by status"
        name="status-filter"
        className="
          appearance-none w-full pl-4 pr-10 py-2.5
          bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600
          dark:text-gray-100
          rounded-lg shadow-sm text-sm
          focus:outline-none focus:ring-2
          focus:ring-teal-500 focus:border-teal-400
          transition-all duration-200
        "
      >
        <option value="" className="text-sm">All Statuses</option>
        {Object.values(ConsignmentStatus).map(status => (
          <option key={status} value={status} className="text-sm">
            {status}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
        <FaChevronDown className="h-3 w-3 text-gray-500 dark:text-gray-400" />
      </div>
    </div>
  );
};

export default StatusFilterDropdown;
