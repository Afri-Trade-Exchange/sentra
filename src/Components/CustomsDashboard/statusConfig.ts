import { FaCheckCircle, FaExclamationTriangle, FaTimesCircle } from 'react-icons/fa';
import { ConsignmentStatus } from './types';

export const STATUS_CONFIG = {
  [ConsignmentStatus.Pending]: {
    icon: FaExclamationTriangle,
    color: 'text-yellow-500 bg-yellow-50',
    bgColor: 'bg-yellow-100'
  },
  [ConsignmentStatus.Approved]: {
    icon: FaCheckCircle,
    color: 'text-green-500 bg-green-50',
    bgColor: 'bg-green-100'
  },
  [ConsignmentStatus.Rejected]: {
    icon: FaTimesCircle,
    color: 'text-red-500 bg-red-50',
    bgColor: 'bg-red-100'
  }
};
