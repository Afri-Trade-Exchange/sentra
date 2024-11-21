import React from 'react';

interface TraderDetailsModalProps {
  traderName: string;
  traderEmail: string;
  goodsOrdered: string[];
  goodsStatus: string;
  isOpen: boolean;
  onClose: () => void;
}

const TraderDetailsModal: React.FC<TraderDetailsModalProps> = ({
  traderName,
  traderEmail,
  goodsOrdered,
  goodsStatus,
  isOpen,
  onClose
}) => {
  const [status, setStatus] = React.useState(goodsStatus);

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(event.target.value);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
      <div className={`bg-white rounded-lg p-8 shadow-lg max-w-lg w-full transition-transform transform ${isOpen ? 'scale-100' : 'scale-95'}`}>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">{traderName}</h2>
        <p className="text-gray-700 mb-2"><strong>Email:</strong> {traderEmail}</p>
        <h3 className="mt-4 font-semibold text-lg text-gray-800">Goods Ordered:</h3>
        <ul className="list-disc pl-5 mb-4">
          {goodsOrdered.map((item, index) => (
            <li key={index} className="text-gray-600">{item}</li>
          ))}
        </ul>
        <p className="mt-2 text-gray-700"><strong>Status of Goods:</strong></p>
        <select 
          value={status} 
          onChange={handleStatusChange} 
          title="Select the status of goods" 
          className={`mt-2 mb-4 p-2 border rounded ${status === 'delivered' ? 'bg-green-200' : status === 'pending' ? 'bg-yellow-200' : 'bg-gray-200'}`}
        >
          <option value="in_transit">In Transit</option>
          <option value="delivered">Delivered</option>
          <option value="pending">Pending</option>
        </select>
        <p className="text-gray-700">{status}</p>
        <button 
          onClick={onClose} 
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default TraderDetailsModal; 