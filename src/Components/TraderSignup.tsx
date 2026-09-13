import React, { useState, useCallback, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaApple } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import HeroSection from './HeroSection';
import { GoogleAuthProvider, OAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import { signupUser, resolveOAuthUserRole, getAuthErrorMessage } from '../firebase/authService';
import './TraderSignup.css';

type UserRole = 'trader' | 'customs';

interface FormState {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  isLoading: boolean;
}

type FieldErrors = Partial<Record<'fullName' | 'email' | 'password' | 'confirmPassword', string>>;

const TraderSignup: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formState, setFormState] = useState<FormState>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    isLoading: false
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFieldErrors(prev => ({ ...prev, [name]: undefined }));
    setFormError(null);
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = (): { isValid: boolean; errors: FieldErrors } => {
    const errors: FieldErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formState.fullName.trim()) {
      errors.fullName = 'Full name is required';
    }

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
    setFieldErrors(errors);

    if (!isValid) {
      return;
    }

    try {
      setFormState(prev => ({ ...prev, isLoading: true }));
      await signupUser({
        email: formState.email,
        password: formState.password,
        name: formState.fullName.trim(),
        role: 'trader' as UserRole
      });
      navigate('/dashboard');
    } catch (err) {
      console.error('Signup error:', err);
      setFormError(getAuthErrorMessage(err, 'Failed to create account. Please try again.'));
    } finally {
      setFormState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleGoogleSignUp = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    try {
      setFormState(prev => ({ ...prev, isLoading: true }));
      setFormError(null);
      const { user } = await signInWithPopup(auth, provider);
      const role = await resolveOAuthUserRole(user);
      navigate(role === 'customs' ? '/customs-dashboard' : '/dashboard');
    } catch (err) {
      console.error('Google sign-up error:', err);
      setFormError(getAuthErrorMessage(err, 'Failed to sign up with Google. Please try again.'));
    } finally {
      setFormState(prev => ({ ...prev, isLoading: false }));
    }
  }, [navigate]);

  const handleAppleSignUp = useCallback(async () => {
    const provider = new OAuthProvider('apple.com');
    try {
      setFormState(prev => ({ ...prev, isLoading: true }));
      setFormError(null);
      const { user } = await signInWithPopup(auth, provider);
      const role = await resolveOAuthUserRole(user);
      navigate(role === 'customs' ? '/customs-dashboard' : '/dashboard');
    } catch (err) {
      console.error('Apple sign-up error:', err);
      setFormError(getAuthErrorMessage(err, 'Failed to sign up with Apple. Please try again.'));
    } finally {
      setFormState(prev => ({ ...prev, isLoading: false }));
    }
  }, [navigate]);

  const inputClass = (field: keyof FieldErrors) =>
    `w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 ${
      fieldErrors[field] ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-teal-500'
    }`;

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow flex bg-stone-100">
          {/* Left side - HeroSection */}
          <div className="hidden lg:flex lg:w-2/5">
            <HeroSection />
          </div>

          {/* Right side - Sign Up Form */}
          <div className="w-full lg:w-3/5 flex items-center justify-center bg-white p-8">
            <div className="w-full max-w-md py-10 sm:py-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-2 text-center text-gray-800">
                Create an account
              </h2>
              <p className="text-gray-600 mb-8 text-center">
                Welcome. Please enter your details.
              </p>

              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                {formError && (
                  <div className="p-4 mb-1 text-red-700 bg-red-100 rounded-xl text-sm">
                    {formError}
                  </div>
                )}

                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                    Full name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    name="fullName"
                    autoComplete="name"
                    className={inputClass('fullName')}
                    value={formState.fullName}
                    onChange={handleInputChange}
                  />
                  {fieldErrors.fullName && (
                    <p className="mt-1.5 text-xs text-red-600">{fieldErrors.fullName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    className={inputClass('email')}
                    value={formState.email}
                    onChange={handleInputChange}
                  />
                  {fieldErrors.email && (
                    <p className="mt-1.5 text-xs text-red-600">{fieldErrors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      autoComplete="new-password"
                      className={inputClass('password')}
                      value={formState.password}
                      onChange={handleInputChange}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  <p className={`mt-1.5 text-xs ${fieldErrors.password ? 'text-red-600' : 'text-gray-500'}`}>
                    {fieldErrors.password || 'At least 8 characters'}
                  </p>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm password
                  </label>
                  <input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    autoComplete="new-password"
                    className={inputClass('confirmPassword')}
                    value={formState.confirmPassword}
                    onChange={handleInputChange}
                  />
                  {fieldErrors.confirmPassword && (
                    <p className="mt-1.5 text-xs text-red-600">{fieldErrors.confirmPassword}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={formState.isLoading}
                  className="w-full py-3 px-4 bg-teal-600 text-white rounded-xl font-medium
                           hover:bg-teal-700 transform transition-all duration-200
                           hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {formState.isLoading ? 'Creating account...' : 'Create Account'}
                </button>

                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-4 text-sm bg-white text-gray-500">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleGoogleSignUp}
                    disabled={formState.isLoading}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3
                             border border-gray-300 rounded-xl font-medium
                             text-gray-700 bg-white hover:bg-gray-50 transform
                             transition-all duration-200 hover:scale-[1.02] disabled:opacity-50"
                  >
                    <FcGoogle className="text-lg" /> Google
                  </button>
                  <button
                    type="button"
                    onClick={handleAppleSignUp}
                    disabled={formState.isLoading}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3
                             border border-gray-300 rounded-xl font-medium
                             text-gray-700 bg-white hover:bg-gray-50 transform
                             transition-all duration-200 hover:scale-[1.02] disabled:opacity-50"
                  >
                    <FaApple className="text-lg" /> Apple
                  </button>
                </div>
              </form>

              <p className="mt-8 text-center text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-teal-600 hover:underline font-medium">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
  );
};

export default React.memo(TraderSignup);
