import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import { QrScannerData } from './types';

const QrScannerModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (data: QrScannerData) => void;
}> = ({ isOpen, onClose, onScanSuccess }) => {
  const [error, setError] = useState<string>('');
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    scannerRef.current = new Html5QrcodeScanner(
      "qr-reader",
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      },
      false
    );

    scannerRef.current.render(
      async (decodedText) => {
        try {
          const qrData = JSON.parse(decodedText);
          if (!qrData.consignmentId || typeof qrData.consignmentId !== 'string') {
            setError('Invalid QR code');
            return;
          }
          const consignmentDoc = await getDoc(doc(db, 'consignments', qrData.consignmentId));
          if (consignmentDoc.exists()) {
            const consignmentData = {
              ...consignmentDoc.data(),
              consignmentId: consignmentDoc.id,
            } as QrScannerData;
            onScanSuccess(consignmentData);
            if (scannerRef.current) {
              await scannerRef.current.clear();
            }
            onClose();
          } else {
            setError('Consignment not found');
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Invalid QR code');
        }
      },
      () => {}
    );

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
      }
    };
  }, [isOpen, onClose, onScanSuccess]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Scan QR Code</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close QR code scanner"
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div id="qr-reader" className="w-full"></div>

        {error && (
          <p className="mt-2 text-red-500 text-sm">{error}</p>
        )}
      </div>
    </div>
  );
};

export default QrScannerModal;
