import React, { useState } from 'react';
import { FaQuestion } from 'react-icons/fa';

const HelpButton: React.FC = () => {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <button
        type="button"
        onClick={() => setShowHelp(!showHelp)}
        className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
        aria-label="Help"
      >
        <FaQuestion className="w-6 h-6 text-gray-600" />
      </button>

      {showHelp && (
        <div className="absolute bottom-full left-0 mb-2 p-4 bg-white rounded-2xl shadow-xl border border-gray-100 w-64">
          <h4 className="font-semibold mb-2">Quick Help</h4>
          <ul className="space-y-2 text-sm">
            <li>• Click a card to select it, or "View Details" to inspect it</li>
            <li>• Use filters to narrow results</li>
            <li>• Create a New Consignment for a trader</li>
            <li>• Export data using quick actions</li>
            <li>• Scan QR codes for consignment details</li>
            <li>• Check notifications for any updates</li>
            <li>• Contact support for any issues</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default HelpButton;
