interface ConsignmentData {
  traderName: string;
  traderEmail: string;
  documentType: string;
  description: string;
  estimatedValue: number;
  goodsOrdered: string[];
  goodsStatus: string;
}

interface NewConsignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ConsignmentData) => void;
}

import React, { useState } from 'react';

const NewConsignmentModal: React.FC<NewConsignmentModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    traderName: '',
    traderEmail: '',
    documentType: '',
    description: '',
    estimatedValue: '',
    goodsOrdered: '',
    goodsStatus: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      estimatedValue: Number(formData.estimatedValue),
      goodsOrdered: formData.goodsOrdered.split(',').map(item => item.trim())
    });
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl p-6 md:p-8 max-w-lg w-full shadow-2xl animate-[fadeIn_0.2s_ease-out]"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">New Consignment</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="traderName" className="block text-sm font-medium text-gray-700 mb-1">
              Trader Name
            </label>
            <input
              id="traderName"
              type="text"
              value={formData.traderName}
              onChange={(e) => setFormData({...formData, traderName: e.target.value})}
              className="w-full rounded-lg border-gray-300 shadow-sm transition-colors
                focus:border-blue-500 focus:ring-blue-500 focus:ring-2 focus:ring-offset-2"
              required
            />
          </div>

          <div>
            <label htmlFor="traderEmail" className="block text-sm font-medium text-gray-700 mb-1">
              Trader Email
            </label>
            <input
              id="traderEmail"
              type="email"
              value={formData.traderEmail}
              onChange={(e) => setFormData({...formData, traderEmail: e.target.value})}
              className="w-full rounded-lg border-gray-300 shadow-sm transition-colors
                focus:border-blue-500 focus:ring-blue-500 focus:ring-2 focus:ring-offset-2"
              required
            />
          </div>

          <div>
            <label htmlFor="documentType" className="block text-sm font-medium text-gray-700 mb-1">
              Document Type
            </label>
            <select
              id="documentType"
              value={formData.documentType}
              onChange={(e) => setFormData({...formData, documentType: e.target.value})}
              className="w-full rounded-lg border-gray-300 shadow-sm transition-colors
                focus:border-blue-500 focus:ring-blue-500 focus:ring-2 focus:ring-offset-2"
              required
            >
              <option value="">Select type...</option>
              <option value="Import">Import</option>
              <option value="Export">Export</option>
              <option value="Transit">Transit</option>
            </select>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full rounded-lg border-gray-300 shadow-sm transition-colors
                focus:border-blue-500 focus:ring-blue-500 focus:ring-2 focus:ring-offset-2"
              rows={3}
              required
            />
          </div>

          <div>
            <label htmlFor="estimatedValue" className="block text-sm font-medium text-gray-700 mb-1">
              Estimated Value
            </label>
            <input
              id="estimatedValue"
              type="number"
              value={formData.estimatedValue}
              onChange={(e) => setFormData({...formData, estimatedValue: e.target.value})}
              className="w-full rounded-lg border-gray-300 shadow-sm transition-colors
                focus:border-blue-500 focus:ring-blue-500 focus:ring-2 focus:ring-offset-2"
              required
            />
          </div>

          <div>
            <label htmlFor="goodsOrdered" className="block text-sm font-medium text-gray-700 mb-1">
              Goods Ordered (comma-separated)
            </label>
            <input
              id="goodsOrdered"
              type="text"
              value={formData.goodsOrdered}
              onChange={(e) => setFormData({...formData, goodsOrdered: e.target.value})}
              className="w-full rounded-lg border-gray-300 shadow-sm transition-colors
                focus:border-blue-500 focus:ring-blue-500 focus:ring-2 focus:ring-offset-2"
              placeholder="Item 1, Item 2, Item 3"
              required
            />
          </div>

          <div>
            <label htmlFor="goodsStatus" className="block text-sm font-medium text-gray-700 mb-1">
              Goods Status
            </label>
            <select
              id="goodsStatus"
              value={formData.goodsStatus}
              onChange={(e) => setFormData({...formData, goodsStatus: e.target.value})}
              className="w-full rounded-lg border-gray-300 shadow-sm transition-colors
                focus:border-blue-500 focus:ring-blue-500 focus:ring-2 focus:ring-offset-2"
              required
            >
              <option value="">Select status...</option>
              <option value="In Transit">In Transit</option>
              <option value="Delivered">Delivered</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 
                rounded-lg hover:bg-gray-200 transition-colors focus:outline-none 
                focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2.5 text-sm font-medium text-white bg-blue-600 
                rounded-lg hover:bg-blue-700 transition-colors focus:outline-none 
                focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Create Consignment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewConsignmentModal;
