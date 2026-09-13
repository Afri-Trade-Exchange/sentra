import React, { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { resetPassword, isValidEmail } from '../firebase/authService';
import AuthLayout from './Auth/AuthLayout';
import TextField from './Auth/TextField';
import FormError from './Auth/FormError';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!isValidEmail(email)) {
      setError('Enter a valid email address.');
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(email);
    } catch (err) {
      // Firebase can throw auth/user-not-found for unregistered emails; we still
      // show the same success state below so we don't reveal which emails exist.
      console.error('Password reset error:', err);
    } finally {
      setIsLoading(false);
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <AuthLayout>
        <h2 className="text-3xl sm:text-4xl font-bold mb-2 text-center text-gray-800">
          Check your email
        </h2>
        <p className="text-gray-600 mb-8 text-center">
          If an account exists for <span className="font-medium">{email}</span>, we've sent a link to reset your password.
        </p>
        <Link
          to="/login"
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-teal-600 text-white rounded-xl font-medium
                   hover:bg-teal-700 transform transition-all duration-200 hover:scale-[1.02]"
        >
          Back to sign in
        </Link>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <h2 className="text-3xl sm:text-4xl font-bold mb-2 text-center text-gray-800">
        Forgot your password?
      </h2>
      <p className="text-gray-600 mb-8 text-center">
        Enter your email and we'll send you a link to reset it.
      </p>

      <form className="space-y-5" onSubmit={handleSubmit}>
        {error && <FormError message={error} />}

        <TextField
          id="email"
          name="email"
          type="email"
          label="Email address"
          required
          autoComplete="email"
          placeholder="johndoe@example.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 bg-teal-600 text-white rounded-xl font-medium
                   hover:bg-teal-700 transform transition-all duration-200
                   hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isLoading ? 'Sending...' : 'Send reset link'}
        </button>
      </form>

      <Link
        to="/login"
        className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-teal-600"
      >
        <FaArrowLeft className="text-xs" /> Back to sign in
      </Link>
    </AuthLayout>
  );
};

export default ForgotPassword;
