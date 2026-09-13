import React from 'react';

const FormError: React.FC<{ message: string }> = ({ message }) => (
  <div className="p-4 text-red-700 bg-red-100 rounded-xl text-sm">
    {message}
  </div>
);

export default FormError;
