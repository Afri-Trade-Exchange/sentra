import React from 'react';

interface TextFieldProps {
  id: string;
  name: string;
  type?: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  autoComplete?: string;
  required?: boolean;
  placeholder?: string;
  error?: string;
}

const TextField: React.FC<TextFieldProps> = ({
  id, name, type = 'text', label, value, onChange, autoComplete, required, placeholder, error
}) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <input
      id={id}
      name={name}
      type={type}
      required={required}
      autoComplete={autoComplete}
      placeholder={placeholder}
      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 ${
        error ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-teal-500'
      }`}
      value={value}
      onChange={onChange}
    />
    {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
  </div>
);

export default TextField;
