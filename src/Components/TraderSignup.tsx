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

interface AuthError {
  message: string;
}

const TraderSignup: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [accountType, setAccountType] = useState('trader');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [formState, setFormState] = useState({
    data: formData,
    errors: {},
    isLoading: false
  });
  const [error, setError] = useState<AuthError | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
    setFormState(prev => ({ ...prev, data: { ...prev.data, [name]: value } }));
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    return errors;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setFormState(prev => ({ ...prev, errors: validationErrors }));
      setIsSubmitting(false);
      return;
    }

    setFormState(prev => ({ ...prev, isLoading: true }));

    try {
      const userRole: UserRole = await signupUser({
        ...formState.data,  // Changed from formData
        role: accountType as UserRole
      });
      
      // Navigate based on user role
      switch(userRole) {
        case 'trader':
          navigate('/dashboard');
          break;
        case 'customs':
          navigate('/customs-dashboard');
          break;
        default:
          throw new Error('Invalid user role');
      }
    } catch (error) {
      setFormState(prev => ({
        ...prev,
        errors: { 
          submit: error instanceof Error 
            ? error.message 
            : 'An unexpected error occurred'  
        }
      }));
    } finally {
      setFormState(prev => ({ ...prev, isLoading: false }));
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignUp = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    try {
      setFormState(prev => ({ ...prev, isLoading: true }));
      setError(null);
      await signInWithPopup(auth, provider);
      // Navigate based on account type
      if (accountType === 'trader') {
        navigate('/dashboard');
      } else if (accountType === 'customs') {
        navigate('/customs-dashboard');
      }
    } catch (err) {
      setError({ message: 'Failed to sign up with Google' });
    } finally {
      setFormState(prev => ({ ...prev, isLoading: false }));
    }
  }, [accountType, navigate]);

  return (
    <Layout>
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow flex bg-gray-100">
          {/* Left side - HeroSection */}
          <div className="hidden lg:block w-1/2">
            <HeroSection />
          </div>

          {/* Right side - Sign Up Form */}
          <div className="w-full lg:w-1/2 flex items-center justify-center p-8 animate-slideIn">
            <div className="max-w-md w-full bg-white shadow-2xl rounded-[15px] p-10 
                            hover:shadow-teal-100 transition-all duration-300">
              <h2 className="text-4xl font-bold mb-8 text-center text-gray-800">Create an Account</h2>
              <p className="text-gray-600 mb-8 text-center">Welcome. Please enter your details.</p>

              {/* Account Type Selector */}
              <div className="flex mb-8 bg-gray-50 rounded-[15px] p-1 hover:bg-gray-100 transition-colors duration-200">
                {['trader', 'customs'].map((type) => (
                  <button
                    key={type}
                    className={`flex-1 py-3 px-4 rounded-[15px] text-sm font-medium 
                               transition-all duration-300 transform hover:scale-[1.02] 
                               ${accountType === type
                                 ? 'bg-teal-500 text-white shadow-md'
                                 : 'bg-transparent text-gray-600 hover:bg-gray-200'
                               } capitalize`}
                    onClick={() => setAccountType(type)}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <input
                  type="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Full Name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-[15px] 
                             focus:outline-none focus:ring-2 focus:ring-teal-500 
                             hover:border-teal-300 transition-all duration-200"
                  required
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="johndoe@gmail.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-[15px] focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200"
                  required
                />
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Password"
                    autoComplete="new-password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-[15px] focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 rounded-[15px] text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <div className="mt-1">
                  {formData.password && (
                    <div className="text-sm">
                      <div className={`flex items-center ${
                        formData.password.length >= 8 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        <span>• Minimum 8 characters</span>
                      </div>
                      <div className={`flex items-center ${
                        /[A-Z]/.test(formData.password) ? 'text-green-600' : 'text-red-600'
                      }`}>
                        <span>• One uppercase letter</span>
                      </div>
                    </div>
                  )}
                </div>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm Password"
                  autoComplete="new-password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-[15px] focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200"
                  required
                />
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  aria-busy={isSubmitting}
                  className={`
                    w-full py-3 rounded-[15px] 
                    transform transition-all duration-200 
                    font-medium shadow-sm hover:shadow-md
                    ${isSubmitting 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-teal-500 hover:bg-teal-600 active:bg-teal-700 hover:scale-[1.01]'
                    }
                    text-white
                  `}
                >
                  {isSubmitting ? 'Signing up...' : 'Sign Up'}
                </button>
              </form>

              <div className="mt-8">
                {error && (
                  <div role="alert" className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                    {error.message}
                  </div>
                )}
                
                <button 
                  onClick={handleGoogleSignUp}
                  disabled={formState.isLoading}
                  aria-busy={formState.isLoading}
                  className={`
                    w-full border border-gray-300 text-gray-700 py-3 rounded-[15px] 
                    hover:bg-gray-50 hover:border-teal-300 transform hover:scale-[1.01] 
                    transition-all duration-200 flex items-center justify-center 
                    font-medium shadow-sm hover:shadow-md
                    ${formState.isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  <FaGoogle className="mr-2 text-teal-500" />
                  {formState.isLoading ? 'Signing up...' : 'Sign up with Google'}
                </button>
              </div>
              <div className="mt-8 text-center text-gray-600">
                Already have an account? {' '}
                <Link 
                  to="/login" 
                  className="text-teal-500 hover:underline font-medium"
                  aria-label="Login to your existing account"
                >
                  Login here
                </Link>
                <div className="mt-8 text-center text-grey-600">
                  Forgot your password? {' '}
                <Link 
                      to="/forgot-password" 
                      className="text-teal-500 hover:underline font-medium"
                      aria-label='Forgot your password?'
                >
                  Reset Here
                </Link>
                </div>
              </div>
            </div>
          </div>
        </div>  
      </div>
    </Layout>
  );
};

export default React.memo(TraderSignup);