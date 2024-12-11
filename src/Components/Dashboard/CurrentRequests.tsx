import { useState, useEffect } from 'react';
import { FaQrcode, FaFileAlt, FaClock, FaCheckCircle } from 'react-icons/fa';

interface Document {
  type: string;
  file: File | null;
}

interface Request {
  id: string;
  timestamp: string;
  status: string;
  documentCount: number;
  documents: Record<string, Document>;
  qrCode: string;
}

export default function CurrentRequests() {
  const [requests, setRequests] = useState<Request[]>([]);

  useEffect(() => {
    // Load requests from localStorage
    const savedRequests = JSON.parse(localStorage.getItem('currentRequests') || '[]');
    setRequests(savedRequests);
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Current Requests</h2>
      
      {requests.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No current requests</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {requests.map((request) => (
            <div 
              key={request.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <FaQrcode className="text-indigo-600" />
                    <span className="font-mono text-sm text-gray-600">{request.id}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <FaFileAlt className="text-gray-400" />
                      {request.documentCount} documents
                    </span>
                    <span className="flex items-center gap-1">
                      <FaClock className="text-gray-400" />
                      {new Date(request.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`
                    px-3 py-1 rounded-full text-sm font-medium
                    ${request.status === 'Pending Clearance' 
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'}
                  `}>
                    {request.status}
                  </span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                {Object.entries(request.documents)
                  .filter(([, doc]: [string, Document]) => doc.file !== null)
                  .map(([key, doc]: [string, Document]) => (
                    <div key={key} className="flex items-center gap-2 text-gray-600">
                      <FaCheckCircle className="text-green-500" />
                      {doc.type}
                    </div>
                  ))
                }
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
