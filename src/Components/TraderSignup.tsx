import React, { useState, useCallback, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaGoogle } from 'react-icons/fa';
import Layout from './Layout';
import HeroSection from './HeroSection';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig'; 
import { signupUser } from '../firebase/authService';
import './TraderSignup.css';

type UserRole = 'trader' | 'customs';

interface FormState {
  email: string;
  password: string;
  confirmPassword: string;
  accountType: 'trader' | 'customs';
  isLoading: boolean;
}

interface AuthError {
  message: string;
}

const TraderSignup: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formState, setFormState] = useState<FormState>({
    email: '',
    password: '',
    confirmPassword: '',
    accountType: 'trader',
    isLoading: false
  });
  const [error, setError] = useState<AuthError | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setError(null); // Clear error on input change
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = (): { isValid: boolean; errors: { [key: string]: string } } => {
    const errors: { [key: string]: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formState.email) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(formState.email)) {
      errors.email = 'Invalid email format';
    }

    if (!formState.password) {
      errors.password = 'Password is required';
    } else if (formState.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }

    if (!formState.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formState.password !== formState.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { isValid, errors } = validateForm();

    if (!isValid) {
      setError({ message: Object.values(errors)[0] });
      return;
    }

    try {
      setFormState(prev => ({ ...prev, isLoading: true }));
      await signupUser({
        email: formState.email,
        password: formState.password,
        name: '',  // Add a default empty name
        role: formState.accountType as UserRole
      });
      navigate(formState.accountType === 'customs' ? '/customs-dashboard' : '/dashboard');
    } catch (err) {
      setError({ message: 'Failed to create account' });
    } finally {
      setFormState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleGoogleSignUp = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    try {
      setFormState(prev => ({ ...prev, isLoading: true }));
      setError(null);
      await signInWithPopup(auth, provider);
      // Navigate based on account type
      if (formState.accountType === 'trader') {
        navigate('/dashboard');
      } else if (formState.accountType === 'customs') {
        navigate('/customs-dashboard');
      }
    } catch (err) {
      setError({ message: 'Failed to sign up with Google' });
    } finally {
      setFormState(prev => ({ ...prev, isLoading: false }));
    }
  }, [formState.accountType, navigate]);

  return (
    <Layout>
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow flex bg-gray-100">
          {/* Left side - HeroSection */}
          <div className="hidden lg:flex lg:w-1/2 bg-gray-50">
            <HeroSection />
          </div>

          {/* Right side - Sign Up Form */}
          <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
            <div className="w-full max-w-2xl bg-white shadow-2xl rounded-[20px] p-12 
                          hover:shadow-teal-100 transition-all duration-300">
              <h2 className="text-5xl font-bold mb-8 text-center text-gray-800">
                Create an Account
              </h2>
              <p className="text-xl text-gray-600 mb-10 text-center">
                Welcome. Please enter your details.
              </p>

              <form onSubmit={handleSubmit} className="space-y-8">
                {error && (
                  <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-xl">
                    {error.message}
                  </div>
                )}
                <div className="mb-8">
                  <label className="block text-lg font-medium text-gray-700 mb-3">
                    Account Type
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setFormState(prev => ({ ...prev, accountType: 'trader' }))}
                      className={`p-4 border-2 rounded-xl flex flex-col items-center justify-center transition-all duration-200
                        ${formState.accountType === 'trader' 
                          ? 'border-teal-500 bg-teal-50 text-teal-700' 
                          : 'border-gray-200 hover:border-teal-200'}`}
                    >
                      <svg className="w-8 h-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Trader
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormState(prev => ({ ...prev, accountType: 'customs' }))}
                      className={`p-4 border-2 rounded-xl flex flex-col items-center justify-center transition-all duration-200
                        ${formState.accountType === 'customs' 
                          ? 'border-teal-500 bg-teal-50 text-teal-700' 
                          : 'border-gray-200 hover:border-teal-200'}`}
                    >
                      <svg className="w-8 h-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Customs
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-3">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full text-lg px-6 py-4 border border-gray-300 rounded-xl
                             focus:ring-2 focus:ring-teal-500 focus:border-transparent
                             transition-all duration-200"
                    value={formState.email}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-3">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      className="w-full text-lg px-6 py-4 border border-gray-300 rounded-xl
                               focus:ring-2 focus:ring-teal-500 focus:border-transparent
                               transition-all duration-200"
                      value={formState.password}
                      onChange={e => setFormState({ ...formState, password: e.target.value })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-6 top-1/2 transform -translate-y-1/2 
                               text-gray-400 hover:text-gray-600 text-xl"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={formState.isLoading}
                  className="w-full text-lg bg-teal-600 text-white py-4 px-6 rounded-xl
                           hover:bg-teal-700 transform transition-all duration-200
                           hover:scale-[1.02] font-medium"
                >
                  {formState.isLoading ? 'Creating account...' : 'Create Account'}
                </button>

                <div className="relative my-10">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-4 text-lg bg-white text-gray-500">
                      Or continue with
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleSignUp}
                  className="w-full flex items-center justify-center px-6 py-4 
                           border border-gray-300 rounded-xl text-lg font-medium 
                           text-gray-700 bg-white hover:bg-gray-50 transform 
                           transition-all duration-200 hover:scale-[1.02]"
                >
                  <FaGoogle className="mr-3 h-6 w-6 text-red-500" />
                  Sign up with Google
                </button>
              </form>

              <p className="mt-10 text-center text-lg text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-teal-600 hover:underline font-medium">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default React.memo(TraderSignup);