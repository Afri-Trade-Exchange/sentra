import { FaCheckCircle, FaExclamationTriangle, FaTimesCircle } from 'react-icons/fa';
import { ConsignmentStatus } from './types';

export const STATUS_CONFIG = {
  [ConsignmentStatus.Pending]: {
    icon: FaExclamationTriangle,
    color: 'text-yellow-500 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/30'
  },
  [ConsignmentStatus.Approved]: {
    icon: FaCheckCircle,
    color: 'text-green-500 dark:text-green-400 bg-green-50 dark:bg-green-900/20',
    bgColor: 'bg-green-100 dark:bg-green-900/30'
  },
  [ConsignmentStatus.Rejected]: {
    icon: FaTimesCircle,
    color: 'text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20',
    bgColor: 'bg-red-100 dark:bg-red-900/30'
  }
};
