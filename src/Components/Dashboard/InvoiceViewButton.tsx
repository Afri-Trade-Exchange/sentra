import React from 'react';

const InvoiceViewButton: React.FC<{
  onClick: () => void;
  hasInvoice: boolean;
}> = ({ onClick, hasInvoice }) => {
  if (!hasInvoice) return null;

  return (
    <button
      onClick={onClick}
      className="
        text-sm
        font-medium
        text-teal-600
        hover:text-teal-700
        transition-colors
        flex
        items-center
        gap-1
        opacity-80
        hover:opacity-100
      "
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      View Invoice
    </button>
  );
};

export default InvoiceViewButton;
