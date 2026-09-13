import React from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

interface PasswordFieldProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  show: boolean;
  onToggleShow: () => void;
  autoComplete?: string;
  required?: boolean;
  error?: string;
  hint?: string;
}

// `show`/`onToggleShow` are controlled by the parent rather than owned here so a
// form with two password fields (e.g. signup's password + confirm) can share one toggle.
const PasswordField: React.FC<PasswordFieldProps> = ({
  id, name, label, value, onChange, show, onToggleShow, autoComplete, required, error, hint
}) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <div className="relative">
      <input
        id={id}
        name={name}
        type={show ? 'text' : 'password'}
        required={required}
        autoComplete={autoComplete}
        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 ${
          error ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-teal-500'
        }`}
        value={value}
        onChange={onChange}
      />
      <button
        type="button"
        onClick={onToggleShow}
        aria-label={show ? 'Hide password' : 'Show password'}
        className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-gray-600"
      >
        {show ? <FaEyeSlash /> : <FaEye />}
      </button>
    </div>
    {(error || hint) && (
      <p className={`mt-1.5 text-xs ${error ? 'text-red-600' : 'text-gray-500'}`}>
        {error || hint}
      </p>
    )}
  </div>
);

export default PasswordField;
