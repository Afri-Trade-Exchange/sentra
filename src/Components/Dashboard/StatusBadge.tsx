import React from 'react';
import { ActivityStatus, isValidStatus } from '../../types/dashboard';
import { getStatusStyles } from './dashboardUtils';

const StatusBadge: React.FC<{
  status: ActivityStatus;
  onChange: (newStatus: ActivityStatus) => void;
  lastUpdated?: Date;
  updatedBy?: string;
}> = ({ status, onChange, lastUpdated, updatedBy }) => {
  return (
    <div className="relative group">
      <select
        value={status}
        aria-label="Update activity status"
        onChange={(e) => {
          const newStatus = e.target.value;
          if (isValidStatus(newStatus)) {
            onChange(newStatus);
          }
        }}
        className={`
          appearance-none
          w-full
          px-3
          py-1
          rounded-md
          border
          font-medium
          cursor-pointer
          transition-all
          duration-200
          ${getStatusStyles(status)}
          hover:ring-2
          hover:ring-opacity-50
          focus:outline-none
          focus:ring-2
          focus:ring-blue-500
        `}
      >
        {Object.values(ActivityStatus).map((stat) => (
          <option key={stat} value={stat}>{stat}</option>
        ))}
      </select>

      {lastUpdated && (
        <div className="absolute z-10 -top-12 left-0 w-48 p-2 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          Last updated: {lastUpdated.toLocaleString()}
          <br />
          By: {updatedBy}
        </div>
      )}
    </div>
  );
};

export default StatusBadge;
