import React, { useState, useEffect } from 'react';
import { FaFileAlt, FaTimes, FaUpload, FaDownload, FaQrcode, FaCheckCircle } from 'react-icons/fa';
import { QRCodeSVG } from 'qrcode.react';
import jsPDF from 'jspdf';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify?: () => void;  
}

interface DocumentUpload {
  file: File | null;
  type: string;
  progress: number;
  required: boolean; 
}

export default function UploadModal({ isOpen, onClose }: UploadModalProps) {
  const [documents, setDocuments] = useState<{ [key: string]: DocumentUpload }>({
    importDeclaration: { file: null, type: 'Import Declaration', progress: 0, required: true },
    customsEntry: { file: null, type: 'Customs Entry Form', progress: 0, required: true },
    billOfLading: { file: null, type: 'Bill of Lading/Airway Bill', progress: 0, required: true },
    packingList: { file: null, type: 'Packing List', progress: 0, required: true },
    certificate: { file: null, type: 'Certificate of Origin', progress: 0, required: true },
    licenses: { file: null, type: 'Import Licenses and Permits', progress: 0, required: true },
    other: { file: null, type: 'Other Documentation (Optional)', progress: 0, required: false },
  });

  const [uploadSessionId, setUploadSessionId] = useState<string>('');
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    // Generate a unique session ID when the modal opens
    if (isOpen) {
      setUploadSessionId(`UPLOAD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
    }
  }, [isOpen]);

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
    // Simulate verification process
    setIsVerified(true);
    
    // In a real application, you would:
    // 1. Upload all files to your server
    // 2. Generate a unique identifier
    // 3. Store the files with their metadata
    // 4. Return a success response
    
    console.log('Documents verified:', documents);
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
          
          // Add session ID
          pdf.setFontSize(12);
          pdf.setTextColor(100, 100, 100);
          pdf.text(`Session ID: ${uploadSessionId}`, 20, 30);
          
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
          pdf.save(`customs-documents-${uploadSessionId}.pdf`);
        }
        
        // Cleanup
        URL.revokeObjectURL(svgUrl);
      };
      
      img.src = svgUrl;
    }
  };

  // Generate the QR code data
  const qrCodeData = {
    sessionId: uploadSessionId,
    documentCount: Object.values(documents).filter(doc => doc.file !== null).length,
    timestamp: new Date().toISOString(),
    // In production, you'd want to include a secure URL to access these documents
    accessUrl: `https://your-api.com/customs/documents/${uploadSessionId}`
  };

  const handleClose = () => {
    // Add console.log to debug
    console.log('handleClose called');
    
    // If documents are uploaded but not verified, show confirmation
    const hasUploadedDocuments = Object.values(documents).some(doc => doc.file !== null);
    if (hasUploadedDocuments && !isVerified) {
      const confirmClose = window.confirm(
        'You have uploaded documents but haven\'t verified them. Are you sure you want to leave?'
      );
      if (!confirmClose) {
        return;
      }
    }
    
    onClose(); // Make sure this is being called
  };

  // Add handleOutsideClick function
  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Check if the click is on the overlay (outside the modal)
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // If modal isn't open, don't render anything
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleOutsideClick}  // Overlay click handler
    >
      <div 
        className="bg-white rounded-xl w-full max-w-4xl p-8 max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()} // Add this to prevent clicks on modal from closing it
      >
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Documents</h2>
            <p className="text-sm text-gray-600">
              Please upload all required documents in PDF or image format
            </p>
          </div>
          <button 
            onClick={handleClose}
            aria-label="Close upload modal"
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FaTimes className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Upload Progress</span>
            <span className="text-sm text-gray-500">
              {Object.values(documents).filter(doc => doc.file !== null).length} of {Object.values(documents).length} files
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${(Object.values(documents).filter(doc => doc.file !== null).length / Object.values(documents).length) * 100}%` 
              }}
            />
          </div>
        </div>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {Object.entries(documents).map(([key, doc]) => (
            <div
              key={key}
              className={`
                relative p-6 rounded-xl transition-all duration-200
                ${doc.file ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}
                ${doc.required ? 'border-2' : 'border'}
                hover:shadow-md cursor-pointer
              `}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, key)}
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${doc.file ? 'bg-blue-100' : 'bg-gray-200'}`}>
                  <FaFileAlt className={`w-6 h-6 ${doc.file ? 'text-blue-500' : 'text-gray-400'}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{doc.type}</h3>
                    {doc.required ? (
                      <span className="text-xs text-red-500 font-medium">Required</span>
                    ) : (
                      <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                        Optional
                      </span>
                    )}
                  </div>
                  {doc.file ? (
                    <div className="text-sm text-gray-600">
                      <p className="truncate max-w-xs">{doc.file.name}</p>
                      <p className="text-gray-400 text-xs mt-1">
                        {Math.round(doc.file.size / 1024)}KB • Uploaded
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      Drag and drop or click to upload
                    </p>
                  )}
                </div>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => e.target.files?.[0] && handleFileChange(key, e.target.files[0])}
                  />
                  <span className={`
                    inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium
                    ${doc.file 
                      ? 'text-blue-600 bg-blue-100 hover:bg-blue-200' 
                      : 'text-gray-600 bg-gray-200 hover:bg-gray-300'}
                    transition-colors
                  `}>
                    {doc.file ? 'Change' : 'Upload'}
                  </span>
                </label>
              </div>
            </div>
          ))}
        </div>

        {/* QR Code Section */}
        {isVerified && (
          <div className="mb-8 rounded-xl bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50">
            <div className="p-6 border border-blue-200 rounded-xl">
              {/* Success Header */}
              <div className="flex items-center gap-2 mb-6">
                <FaCheckCircle className="text-green-500 w-6 h-6" />
                <h3 className="text-xl font-semibold text-gray-900">
                  Documents Verified Successfully!
                </h3>
              </div>

              {/* Content Grid */}
              <div className="grid md:grid-cols-2 gap-8">
                {/* QR Code Side */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex justify-center mb-4">
                    <QRCodeSVG
                      id="qr-code"
                      value={JSON.stringify(qrCodeData)}
                      size={200}
                      level="H"
                      includeMargin={true}
                      bgColor="#FFFFFF"
                      fgColor="#4F46E5" // Indigo color for QR code
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">
                      Session ID: <span className="font-mono font-medium">{uploadSessionId}</span>
                    </p>
                    <button
                      onClick={handleDownloadQR}
                      className="flex items-center justify-center w-full px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm hover:shadow gap-2"
                    >
                      <FaDownload className="w-4 h-4" />
                      Download QR Code
                    </button>
                  </div>
                </div>

                {/* Instructions Side */}
                <div className="space-y-6">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <FaQrcode className="text-indigo-600" />
                    Next Steps
                  </h4>
                  
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-medium">
                        1
                      </div>
                      <p className="text-sm text-gray-600">
                        Download and save the QR code to your device or print it out
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-medium">
                        2
                      </div>
                      <p className="text-sm text-gray-600">
                        Present this QR code to the customs officer at the border
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-medium">
                        3
                      </div>
                      <p className="text-sm text-gray-600">
                        The officer will scan the code to access your verified documents
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-medium">
                        4
                      </div>
                      <p className="text-sm text-gray-600">
                        Keep this QR code safe - you'll need it for customs clearance
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>Important:</strong> This QR code is your digital key to access your uploaded documents. 
                      Make sure to keep it accessible during your customs clearance process.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end items-center gap-4 pt-4 border-t border-gray-100">
          <button
            onClick={handleClose}  // Updated to use handleClose
            className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleVerify}
            disabled={!areRequiredDocumentsUploaded()}
            className={`
              px-6 py-2 rounded-lg flex items-center gap-2 font-medium
              transition-all duration-200
              ${areRequiredDocumentsUploaded()
                ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-sm hover:shadow'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'}
            `}
          >
            <FaUpload />
            Verify & Upload
          </button>
        </div>
      </div>
    </div>
  );
}
