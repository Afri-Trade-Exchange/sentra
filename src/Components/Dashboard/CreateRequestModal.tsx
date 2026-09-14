import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import * as HeroIcons from '@heroicons/react/24/outline';
import { FaClipboardCheck } from 'react-icons/fa';

const RequestSchema = z.object({
  category: z.enum(['Order', 'Shipment', 'Payment']),
  description: z.string().min(5, 'Description is required'),
  amount: z.number().min(0, 'Amount must be positive'),
});

export type RequestFormData = z.infer<typeof RequestSchema>;

interface CreateRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: RequestFormData) => void;
}

const CreateRequestModal: React.FC<CreateRequestModalProps> = ({ isOpen, onClose, onCreate }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RequestFormData>({
    resolver: zodResolver(RequestSchema),
    defaultValues: {
      category: 'Order',
      description: '',
      amount: 0,
    },
  });

  const onSubmit = (data: RequestFormData) => {
    onCreate(data);
    reset();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 relative">
            <button
              onClick={onClose}
              aria-label="Close Request Modal"
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <HeroIcons.XMarkIcon className="h-6 w-6" />
            </button>

            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
              Create New Request
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                    >
                      <option value="Order">Order</option>
                      <option value="Shipment">Shipment</option>
                      <option value="Payment">Payment</option>
                    </select>
                  )}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                      placeholder="Enter request description"
                    />
                  )}
                />
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Amount
                </label>
                <Controller
                  name="amount"
                  control={control}
                  render={({ field: { onChange, ...field } }) => (
                    <input
                      {...field}
                      type="number"
                      onChange={(e) => onChange(Number(e.target.value))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                      placeholder="Enter amount"
                    />
                  )}
                />
                {errors.amount && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.amount.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 flex items-center"
                >
                  <FaClipboardCheck className="h-5 w-5 mr-2" />
                  Create Request
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreateRequestModal;
