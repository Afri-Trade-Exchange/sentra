import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FaClipboardCheck, FaBox, FaTimes } from 'react-icons/fa';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import { useAuth } from '../AuthContext';
import { ConsignmentStatus } from '../CustomsDashboard/types';

const inputClass = 'mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 shadow-sm focus:border-teal-500 focus:ring focus:ring-teal-200 dark:focus:ring-teal-900/40';
const labelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300';

const ConsignmentSchema = z.object({
  traderName: z.string().min(2, 'Trader name is required'),
  documentType: z.enum(['Import', 'Export', 'Transit', 'Temporary Entry', 'Bonded Warehouse']),
  goodsDescription: z.string().min(10, 'Description must be at least 10 characters'),
  estimatedValue: z.number().min(0, 'Value must be positive'),
  declarationNumber: z.string().optional(),
});

type ConsignmentFormData = z.infer<typeof ConsignmentSchema>;

interface ConsignmentCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (consignmentId: string) => void;
}

const ConsignmentCreationModal: React.FC<ConsignmentCreationModalProps> = ({ isOpen, onClose, onCreated }) => {
  const { user: authUser } = useAuth();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ConsignmentFormData>({
    resolver: zodResolver(ConsignmentSchema),
    defaultValues: {
      traderName: '',
      documentType: 'Import',
      goodsDescription: '',
      estimatedValue: 0,
    },
  });

  const onSubmit = async (data: ConsignmentFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const docRef = await addDoc(collection(db, 'consignments'), {
        traderName: data.traderName,
        traderEmail: authUser?.email ?? '',
        documentType: data.documentType,
        description: data.goodsDescription,
        estimatedValue: data.estimatedValue,
        declarationNumber: data.declarationNumber ?? '',
        goodsStatus: 'Pending',
        goodsOrdered: [] as string[],
        documents: [] as { type: string; fileName: string; sizeKb: number }[],
        status: ConsignmentStatus.Pending,
        createdAt: Timestamp.now(),
      });

      setIsSubmitted(true);

      // Close modal, reset, and hand off to the caller so it can move
      // straight into document upload for the new consignment.
      setTimeout(() => {
        onClose();
        setIsSubmitted(false);
        reset();
        onCreated(docRef.id);
      }, 1500);
    } catch (error) {
      console.error('Failed to create consignment:', error);
      setSubmitError('Failed to create consignment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center max-w-sm w-full">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex flex-col items-center"
          >
            <FaClipboardCheck className="h-20 w-20 text-green-500" />
            <h2 className="text-2xl font-bold mt-4 text-green-600 dark:text-green-400">
              Consignment Created Successfully!
            </h2>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg p-8 relative"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close Consignment Modal"
              className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              <FaTimes className="h-5 w-5" />
            </button>

            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100 flex items-center">
              <FaBox className="h-7 w-7 mr-3 text-teal-600 dark:text-teal-400" />
              Create New Consignment
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {submitError && (
                <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 text-sm text-red-700 dark:text-red-400">
                  {submitError}
                </div>
              )}
              <div>
                <label className={labelClass}>
                  Trader Name
                </label>
                <Controller
                  name="traderName"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      className={inputClass}
                      placeholder="Enter trader name"
                    />
                  )}
                />
                {errors.traderName && (
                  <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                    {errors.traderName.message}
                  </p>
                )}
              </div>

              <div>
                <label className={labelClass}>
                  Document Type
                </label>
                <Controller
                  name="documentType"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className={inputClass}
                    >
                      <option value="Import">Import</option>
                      <option value="Export">Export</option>
                      <option value="Transit">Transit</option>
                      <option value="Temporary Entry">Temporary Entry</option>
                      <option value="Bonded Warehouse">Bonded Warehouse</option>
                    </select>
                  )}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Goods Description
                </label>
                <Controller
                  name="goodsDescription"
                  control={control}
                  render={({ field }) => (
                    <textarea
                      {...field}
                      rows={3}
                      className={inputClass}
                      placeholder="Describe the goods in detail"
                    />
                  )}
                />
                {errors.goodsDescription && (
                  <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                    {errors.goodsDescription.message}
                  </p>
                )}
              </div>

              <div>
                <label className={labelClass}>
                  Estimated Value
                </label>
                <Controller
                  name="estimatedValue"
                  control={control}
                  render={({ field: { onChange, ...field } }) => (
                    <input
                      {...field}
                      type="number"
                      onChange={(e) => onChange(Number(e.target.value))}
                      className={inputClass}
                      placeholder="Enter estimated value"
                    />
                  )}
                />
                {errors.estimatedValue && (
                  <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                    {errors.estimatedValue.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaClipboardCheck className="h-5 w-5 mr-2" />
                  {isSubmitting ? 'Creating...' : 'Create Consignment'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConsignmentCreationModal;
