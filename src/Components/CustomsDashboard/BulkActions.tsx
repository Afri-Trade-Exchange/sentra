import React from 'react';

const BulkActions: React.FC<{
  selectedItems: string[];
  onSelectAll: () => void;
  onAction: (action: string) => void;
}> = ({ selectedItems, onSelectAll, onAction }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex items-center gap-4">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={selectedItems.length > 0}
          onChange={onSelectAll}
          className="rounded text-teal-600 focus:ring-teal-500"
          aria-label="Select all items"
        />
        <span className="text-sm text-gray-600">
          {selectedItems.length} selected
        </span>
      </div>

      <select
        aria-label="Select bulk action"
        onChange={(e) => onAction(e.target.value)}
        className="rounded-md border-gray-300 text-sm focus:border-teal-500 focus:ring-teal-500"
        disabled={selectedItems.length === 0}
      >
        <option value="">Bulk Actions</option>
        <option value="approve">Approve Selected</option>
        <option value="reject">Reject Selected</option>
        <option value="export">Export Selected</option>
      </select>

      <button
        type="button"
        disabled={selectedItems.length === 0}
        className="px-4 py-2 bg-teal-600 text-white text-sm rounded-md hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        Apply
      </button>
    </div>
  );
};

export default BulkActions;
