import React from 'react';
import { ConsignmentStatus, TimelineEvent } from './types';
import Card from '../ui/Card';
import SectionHeader from '../ui/SectionHeader';

const ConsignmentTimeline: React.FC<{ timelineEvents: TimelineEvent[] }> = ({ timelineEvents }) => {
  return (
    <Card>
      <SectionHeader title="Consignment Timeline" />
      <div className="relative mt-4">
        <div className="border-l-2 border-gray-200 dark:border-gray-700 ml-4 space-y-6">
          {timelineEvents.map((event) => (
            <div key={event.id} className="relative">
              <div className="absolute -left-[9px] mt-2">
                <div className={`
                  w-4 h-4 rounded-full border-2 border-white dark:border-gray-800
                  ${event.status === ConsignmentStatus.Approved ? 'bg-green-500' :
                    event.status === ConsignmentStatus.Rejected ? 'bg-red-500' :
                    'bg-teal-500'}
                `} />
              </div>
              <div className="ml-6 pb-6">
                <div className="flex items-center">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{event.title}</p>
                  <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                    {event.timestamp.toLocaleDateString()}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default ConsignmentTimeline;
