import React from 'react';

interface TraderDetailsModalProps {
  traderName: string;
  traderEmail: string;
  goodsOrdered: string[];
  goodsStatus: string;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (status: string) => void;
}

const TraderDetailsModal: React.FC<TraderDetailsModalProps> = ({
  traderName,
  traderEmail,
  goodsOrdered,
  goodsStatus,
  isOpen,
  onClose,
  onStatusChange
}) => {
  if (!isOpen) return null;

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onStatusChange(event.target.value);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 p-4">
      <div className={`bg-white rounded-lg p-8 shadow-lg max-w-lg w-full transition-transform transform ${isOpen ? 'scale-100' : 'scale-95'}`}>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">{traderName}</h2>
        <p className="text-gray-700 mb-2"><strong>Email:</strong> {traderEmail}</p>
        <h3 className="mt-4 font-semibold text-lg text-gray-800">Goods Ordered:</h3>
        {goodsOrdered.length > 0 ? (
          <ul className="list-disc pl-5 mb-4">
            {goodsOrdered.map((item, index) => (
              <li key={index} className="text-gray-600">{item}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm mb-4">No goods listed for this consignment.</p>
        )}
        <p className="mt-2 text-gray-700"><strong>Status of Goods:</strong></p>
        <select
          value={goodsStatus}
          onChange={handleStatusChange}
          title="Select the status of goods"
          className={`mt-2 mb-4 p-2 border rounded ${goodsStatus === 'Delivered' ? 'bg-green-200' : goodsStatus === 'Pending' ? 'bg-yellow-200' : 'bg-gray-200'}`}
        >
          <option value="Pending">Pending</option>
          <option value="Documents Submitted">Documents Submitted</option>
          <option value="In Transit">In Transit</option>
          <option value="Delivered">Delivered</option>
        </select>
        <button
          onClick={onClose}
          className="mt-4 px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition duration-200"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default TraderDetailsModal;
