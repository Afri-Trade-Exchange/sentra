import React, { useState } from 'react';
import { FaFileAlt, FaTimes, FaUpload, FaDownload, FaQrcode, FaCheckCircle } from 'react-icons/fa';
import { QRCodeSVG } from 'qrcode.react';
import jsPDF from 'jspdf';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify?: () => void;
  consignmentId: string | null;
}

interface DocumentUpload {
  file: File | null;
  type: string;
  progress: number;
  required: boolean; 
}

export default function UploadModal({ isOpen, onClose, consignmentId }: UploadModalProps) {
  const [documents, setDocuments] = useState<{ [key: string]: DocumentUpload }>({
    importDeclaration: { file: null, type: 'Import Declaration', progress: 0, required: true },
    customsEntry: { file: null, type: 'Customs Entry Form', progress: 0, required: true },
    billOfLading: { file: null, type: 'Bill of Lading/Airway Bill', progress: 0, required: true },
    packingList: { file: null, type: 'Packing List', progress: 0, required: true },
    certificate: { file: null, type: 'Certificate of Origin', progress: 0, required: true },
    licenses: { file: null, type: 'Import Licenses and Permits', progress: 0, required: true },
    other: { file: null, type: 'Other Documentation (Optional)', progress: 0, required: false },
  });

  const [isVerified, setIsVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  const handleFileChange = (key: string, file: File) => {
    setDocuments(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        file,
        progress: 100, // Simulated upload progress
      }
    }));
  };

  const handleDrop = (e: React.DragEvent, key: string) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileChange(key, file);
  };

  const areRequiredDocumentsUploaded = () => {
    return Object.values(documents).every(doc => 
      !doc.required || (doc.required && doc.file !== null)
    );
  };

  const handleVerify = async () => {
    if (!consignmentId) {
      setVerifyError('No consignment is linked to this upload. Please create a consignment first.');
      return;
    }

    setIsVerifying(true);
    setVerifyError(null);

    try {
      const uploadedDocs = Object.values(documents)
        .filter((docUpload) => docUpload.file !== null)
        .map((docUpload) => ({
          type: docUpload.type,
          fileName: docUpload.file!.name,
          sizeKb: Math.round(docUpload.file!.size / 1024),
        }));

      await updateDoc(doc(db, 'consignments', consignmentId), {
        documents: uploadedDocs,
        goodsStatus: 'Documents Submitted',
      });

      setIsVerified(true);
    } catch (error) {
      console.error('Document verification failed:', error);
      setVerifyError('Failed to submit documents. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleDownloadQR = () => {
    const qrCodeElement = document.getElementById('qr-code');
    
    if (qrCodeElement) {
      // Create new PDF document
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Convert SVG to canvas first for better compatibility
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 1000;  // Higher resolution
      canvas.height = 1000; // Higher resolution
      
      // Convert SVG to data URL
      const svgData = new XMLSerializer().serializeToString(qrCodeElement);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);
      
      const img = new Image();
      img.onload = () => {
        if (ctx) {
          // Draw white background
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          // Draw the QR code
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          // Convert canvas to data URL
          const imgData = canvas.toDataURL('image/png');
          
          // Add title
          pdf.setFontSize(20);
          pdf.setTextColor(0, 0, 0);
          pdf.text('Customs Document Access QR Code', 20, 20);
          
          // Add consignment ID
          pdf.setFontSize(12);
          pdf.setTextColor(100, 100, 100);
          pdf.text(`Consignment ID: ${consignmentId}`, 20, 30);
          
          // Add QR code
          const qrSize = 80; // size in mm
          pdf.addImage(imgData, 'PNG', (210 - qrSize) / 2, 40, qrSize, qrSize);
          
          // Add instructions
          pdf.setFontSize(16);
          pdf.setTextColor(0, 0, 0);
          pdf.text('Instructions:', 20, 140);
          
          // Add instruction steps
          pdf.setFontSize(12);
          pdf.setTextColor(60, 60, 60);
          const instructions = [
            '1. Keep this QR code safe and accessible',
            '2. Present this QR code to the customs officer at the border',
            '3. The officer will scan the code to access your verified documents',
            '4. This QR code contains access to the following documents:',
          ];
          
          instructions.forEach((text, index) => {
            pdf.text(text, 25, 155 + (index * 10));
          });
          
          // Add document list
          const uploadedDocs = Object.entries(documents)
            .filter(([, doc]) => doc.file !== null)
            .map(([, doc]) => `• ${doc.type}`);
          
          uploadedDocs.forEach((text, index) => {
            pdf.text(text, 30, 195 + (index * 7));
          });
          
          // Add important notice
          pdf.setFillColor(255, 250, 240); // Light yellow background
          pdf.rect(20, 230, 170, 20, 'F');
          pdf.setTextColor(200, 100, 0); // teal text
          pdf.setFontSize(11);
          pdf.text(
            'IMPORTANT: This QR code is your digital key to access your uploaded documents.',
            25, 240
          );
          pdf.text(
            'Keep it secure and accessible during your customs clearance process.',
            25, 245
          );
          
          // Add timestamp
          pdf.setFontSize(10);
          pdf.setTextColor(150, 150, 150);
          pdf.text(
            `Generated on: ${new Date().toLocaleString()}`,
            20, 280
          );
          
          // Save the PDF
          pdf.save(`customs-documents-${consignmentId}.pdf`);
        }
        
        // Cleanup
        URL.revokeObjectURL(svgUrl);
      };
      
      img.src = svgUrl;
    }
  };

  // The QR code just points at the consignment; the officer's scanner looks up
  // the current record in Firestore rather than trusting data embedded in the code.
  const qrCodeData = { consignmentId };

  const handleClose = () => {
    const hasUploadedDocuments = Object.values(documents).some(doc => doc.file !== null);
    if (hasUploadedDocuments && !isVerified) {
      const confirmClose = window.confirm(
        'You have uploaded documents but haven\'t verified them. Are you sure you want to leave?'
      );
      if (!confirmClose) {
        return;
      }
    }

    onClose();
  };

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleOutsideClick}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-4xl p-4 sm:p-8 max-h-[90vh] overflow-y-auto shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100 dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Upload Documents</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Please upload all required documents in PDF or image format
            </p>
          </div>
          <button
            onClick={handleClose}
            aria-label="Close upload modal"
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <FaTimes className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Upload Progress</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {Object.values(documents).filter(doc => doc.file !== null).length} of {Object.values(documents).length} files
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-teal-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(Object.values(documents).filter(doc => doc.file !== null).length / Object.values(documents).length) * 100}%` }}
            />
          </div>
        </div>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {Object.entries(documents).map(([key, doc]) => (
            <label
              key={key}
              className={`
                relative p-6 rounded-xl transition-colors duration-200 block
                ${doc.file ? 'bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800' : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600'}
                ${doc.required ? 'border-2' : 'border'}
                hover:shadow-sm cursor-pointer
              `}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, key)}
            >
              <input
                type="file"
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => e.target.files?.[0] && handleFileChange(key, e.target.files[0])}
              />
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${doc.file ? 'bg-teal-100 dark:bg-teal-900/40' : 'bg-gray-200 dark:bg-gray-600'}`}>
                  <FaFileAlt className={`w-6 h-6 ${doc.file ? 'text-teal-600 dark:text-teal-400' : 'text-gray-400 dark:text-gray-400'}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">{doc.type}</h3>
                    {doc.required ? (
                      <span className="text-xs text-red-500 dark:text-red-400 font-medium">Required</span>
                    ) : (
                      <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded-full">
                        Optional
                      </span>
                    )}
                  </div>
                  {doc.file ? (
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <p className="truncate max-w-xs">{doc.file.name}</p>
                      <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                        {Math.round(doc.file.size / 1024)}KB • Uploaded
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Drag and drop or click to upload
                    </p>
                  )}
                </div>
                <span className={`
                  inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium shrink-0
                  ${doc.file
                    ? 'text-teal-700 dark:text-teal-300 bg-teal-100 dark:bg-teal-900/40'
                    : 'text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-gray-600'}
                `}>
                  {doc.file ? 'Change' : 'Upload'}
                </span>
              </div>
            </label>
          ))}
        </div>

        {/* QR Code Section */}
        {isVerified && (
          <div className="mb-8 rounded-xl bg-teal-50 dark:bg-teal-900/20">
            <div className="p-6 border border-teal-200 dark:border-teal-800 rounded-xl">
              {/* Success Header */}
              <div className="flex items-center gap-2 mb-6">
                <FaCheckCircle className="text-teal-600 dark:text-teal-400 w-6 h-6" />
                <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100">
                  Documents Verified Successfully!
                </h3>
              </div>

              {/* Content Grid */}
              <div className="grid md:grid-cols-2 gap-8">
                {/* QR Code Side */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                  <div className="flex justify-center mb-4">
                    <QRCodeSVG
                      id="qr-code"
                      value={JSON.stringify(qrCodeData)}
                      size={200}
                      level="H"
                      includeMargin={true}
                      bgColor="#FFFFFF"
                      fgColor="#0d9488"
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Consignment ID: <span className="font-mono font-medium">{consignmentId}</span>
                    </p>
                    <button
                      onClick={handleDownloadQR}
                      className="flex items-center justify-center w-full px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors gap-2 font-medium"
                    >
                      <FaDownload className="w-4 h-4" />
                      Download QR Code
                    </button>
                  </div>
                </div>

                {/* Instructions Side */}
                <div className="space-y-6">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <FaQrcode className="text-teal-600 dark:text-teal-400" />
                    Next Steps
                  </h4>

                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-400 flex items-center justify-center text-sm font-medium">
                        1
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Download and save the QR code to your device or print it out
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-400 flex items-center justify-center text-sm font-medium">
                        2
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Present this QR code to the customs officer at the border
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-400 flex items-center justify-center text-sm font-medium">
                        3
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        The officer will scan the code to access your verified documents
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-400 flex items-center justify-center text-sm font-medium">
                        4
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Keep this QR code safe - you'll need it for customs clearance
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <p className="text-sm text-yellow-800 dark:text-yellow-400">
                      <strong>Important:</strong> This QR code is your digital key to access your uploaded documents.
                      Make sure to keep it accessible during your customs clearance process.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {!consignmentId && (
          <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg text-sm text-yellow-800 dark:text-yellow-400">
            No consignment is linked to this upload yet. Create a consignment first, then upload its documents.
          </div>
        )}

        {verifyError && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-400">
            {verifyError}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end items-center gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <button
            onClick={handleClose}  // Updated to use handleClose
            className="px-6 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleVerify}
            disabled={!areRequiredDocumentsUploaded() || !consignmentId || isVerifying}
            className={`
              px-6 py-2 rounded-lg flex items-center gap-2 font-medium
              transition-all duration-200
              ${areRequiredDocumentsUploaded() && consignmentId && !isVerifying
                ? 'bg-teal-600 text-white hover:bg-teal-700'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'}
            `}
          >
            <FaUpload />
            {isVerifying ? 'Submitting...' : 'Verify & Upload'}
          </button>
        </div>
      </div>
    </div>
  );
}
