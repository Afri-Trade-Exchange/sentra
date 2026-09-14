import React from 'react';
import { FaClipboardList, FaClock, FaEye, FaHistory, FaUserCircle } from 'react-icons/fa';
import { Activity } from './types';
import Card from '../ui/Card';
import SectionHeader from '../ui/SectionHeader';

const RecentActivity: React.FC<{ activities: Activity[] }> = ({ activities }) => {
  return (
    <Card>
      <SectionHeader
        title="Recent Activity"
        action={(
          <button type="button" className="text-sm text-teal-600 hover:text-teal-700">
            View All
          </button>
        )}
      />
      <div className="mt-4 space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors"
          >
            <div className="mt-1">
              {activity.type === 'status_change' && (
                <FaHistory className="w-5 h-5 text-blue-500" />
              )}
              {activity.type === 'document_upload' && (
                <FaClipboardList className="w-5 h-5 text-green-500" />
              )}
              {activity.type === 'comment' && (
                <FaUserCircle className="w-5 h-5 text-purple-500" />
              )}
              {activity.type === 'review' && (
                <FaEye className="w-5 h-5 text-teal-500" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">{activity.description}</p>
              <div className="flex items-center gap-2 mt-1">
                <FaClock className="w-3 h-3 text-gray-400" />
                <p className="text-xs text-gray-500">
                  {new Date(activity.timestamp).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default RecentActivity;
