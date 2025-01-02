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
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-3">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full text-lg px-6 py-4 border border-gray-300 rounded-xl
                             focus:ring-2 focus:ring-teal-500 focus:border-transparent
                             transition-all duration-200"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
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
                      value={formData.password}
                      onChange={e => setFormData({ ...formData, password: e.target.value })}
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
                  disabled={isSubmitting}
                  className="w-full text-lg bg-teal-600 text-white py-4 px-6 rounded-xl
                           hover:bg-teal-700 transform transition-all duration-200
                           hover:scale-[1.02] font-medium"
                >
                  {isSubmitting ? 'Creating account...' : 'Create Account'}
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