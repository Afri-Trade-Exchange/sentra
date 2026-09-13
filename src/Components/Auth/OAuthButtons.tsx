import React from 'react';
import { FaApple } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

interface OAuthButtonsProps {
  onGoogle: () => void;
  onApple: () => void;
  disabled?: boolean;
  dividerLabel?: string;
}

const buttonClass = "flex-1 flex items-center justify-center gap-2 px-4 py-3 " +
  "border border-gray-300 rounded-xl font-medium text-gray-700 bg-white hover:bg-gray-50 " +
  "transform transition-all duration-200 hover:scale-[1.02] disabled:opacity-50";

const OAuthButtons: React.FC<OAuthButtonsProps> = ({ onGoogle, onApple, disabled, dividerLabel = 'Or continue with' }) => (
  <>
    <div className="relative my-8">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-200" />
      </div>
      <div className="relative flex justify-center">
        <span className="px-4 text-sm bg-white text-gray-500">{dividerLabel}</span>
      </div>
    </div>
    <div className="flex gap-3">
      <button type="button" onClick={onGoogle} disabled={disabled} className={buttonClass}>
        <FcGoogle className="text-lg" /> Google
      </button>
      <button type="button" onClick={onApple} disabled={disabled} className={buttonClass}>
        <FaApple className="text-lg" /> Apple
      </button>
    </div>
  </>
);

export default OAuthButtons;
