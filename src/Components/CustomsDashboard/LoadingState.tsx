import React from 'react';

const LoadingState: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="space-y-4 text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent"></div>
      <p className="text-gray-600">Loading dashboard...</p>
    </div>
  </div>
);

export default LoadingState;
