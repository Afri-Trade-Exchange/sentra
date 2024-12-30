import React, { memo } from 'react';
import { FaGoogle } from 'react-icons/fa';
import { UserRole } from '../firebase/authService';
import type { LoginFormData } from '../hooks/useLoginForm';

interface LoginFormProps {
  formState: {
    data: LoginFormData;
    errors: Record<string, string>;
    isLoading: boolean;
  };
  uiState: {
    showPassword: boolean;
    accountType: UserRole;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onGoogleSignIn: () => void;
  setUiState: React.Dispatch<React.SetStateAction<{
    showPassword: boolean;
    accountType: UserRole;
  }>>;
}

export const LoginForm = memo(({
  formState,
  uiState,
  onInputChange,
  onSubmit,
  onGoogleSignIn,
  setUiState
}: LoginFormProps) => (
  <>
    <div className="flex mb-8 bg-gray-100 rounded-[15px] p-1">
      {['trader', 'customs'].map((type) => (
        <button
          key={type}
          className={`flex-1 py-3 px-4 rounded-[15px] text-sm font-medium transition-all duration-200 ${
            uiState.accountType === type
              ? 'bg-teal-500 text-white shadow-md'
              : 'bg-transparent text-gray-600 hover:bg-gray-200'
          } capitalize`}
          onClick={() => setUiState(prev => ({ ...prev, accountType: type as UserRole }))}
        >
          {type}
        </button>
      ))}
    </div>

    <form onSubmit={onSubmit} className="space-y-6">
      <input
        type="email"
        name="email"
        value={formState.data.email}
        onChange={onInputChange}
        className="w-full px-4 py-3 rounded-[15px] border border-gray-300"
        placeholder="Email address"
      />
      <div className="relative">
        <input
          type={uiState.showPassword ? 'text' : 'password'}
          name="password"
          value={formState.data.password}
          onChange={onInputChange}
          className="w-full px-4 py-3 rounded-[15px] border border-gray-300"
          placeholder="Password"
        />
      </div>
      <button 
        type="submit"
        disabled={formState.isLoading}
        className="w-full bg-teal-500 text-white py-3 rounded-[15px] hover:bg-teal-600 transition-all duration-200"
      >
        {formState.isLoading ? 'Loading...' : 'Sign In'}
      </button>
    </form>

    <div className="mt-8">
      <button 
        onClick={onGoogleSignIn} 
        className="w-full border border-gray-300 text-gray-700 py-3 rounded-[15px] hover:bg-gray-50 transition-all duration-200 flex items-center justify-center font-medium"
      >
        <FaGoogle className="mr-2" /> Sign in with Google
      </button>
    </div>
  </>
));
