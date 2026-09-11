import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FaChevronDown, FaFilter } from 'react-icons/fa';

const AdvancedFilters: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-sm mb-8">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-2">
          <FaFilter className="text-gray-400" />
          <span className="font-medium">Advanced Filters</span>
        </div>
        <FaChevronDown
          className={`transform transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-6 border-t border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date Range
                  </label>
                  <div className="space-y-2">
                    <input
                      type="date"
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                      placeholder="Start Date"
                    />
                    <input
                      type="date"
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                      placeholder="End Date"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="documentType" className="block text-sm font-medium text-gray-700 mb-2">
                    Document Type
                  </label>
                  <select
                    id="documentType"
                    name="documentType"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                  >
                    <option value="">All Types</option>
                    <option value="import">Import</option>
                    <option value="export">Export</option>
                    <option value="transit">Transit</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Value Range
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6 gap-3">
                <button type="button" className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Reset
                </button>
                <button type="button" className="px-4 py-2 bg-teal-600 text-white rounded-md text-sm font-medium hover:bg-teal-700">
                  Apply Filters
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdvancedFilters;
