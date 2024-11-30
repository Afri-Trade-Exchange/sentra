import React, { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaGoogle } from 'react-icons/fa';
import Layout from './Layout';
import Footer from './Footer'; 
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig'; 
import { signupUser } from '../firebase/authService';

type UserRole = 'trader' | 'customs';

export default function TraderSignup() {
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
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
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setFormState(prev => ({ ...prev, errors: validationErrors }));
      return;
    }

    setFormState(prev => ({ ...prev, isLoading: true }));

    try {
      // Use formData instead of formState.data
      const userRole: UserRole = await signupUser({
        ...formData,  // Changed from formState.data
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
    }
  };

  const handleGoogleSignUp = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // Navigate based on account type
      if (accountType === 'trader') {
        navigate('/dashboard');
      } else if (accountType === 'customs') {
        navigate('/customs-dashboard');
      }
    } catch (error) {
      console.error('Google Sign-Up Error', error);
      setFormState(prev => ({
        ...prev,
        errors: { submit: 'Failed to complete Google sign-up' }
      }));
    }
  };

  return (
    <Layout>
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow flex bg-gray-100">
          {/* Left side - Image and Quote */}
          <div className="hidden lg:block w-1/2 bg-cover bg-center relative animate-fadeIn" style={{ backgroundImage: "url('./src/assets/images/paul.png')" }}>
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/90 via-orange-600/85 to-orange-900/90 
                            backdrop-blur-sm flex flex-col justify-center p-12 text-white">
              <h2 className="text-6xl font-bold mb-6 leading-tight">
                Streamline Your <br />
                <span className="text-orange-300">Customs Process</span>
              </h2>
              <p className="text-2xl mb-12 font-light">Unleash efficiency. Save time. Grow your business.</p>
              <blockquote className="bg-white bg-opacity-10 p-8 rounded-2xl shadow-lg backdrop-blur-sm">
                <p className="text-lg mb-4 leading-relaxed italic">
                  "The streamlined customs process between Kenya and Tanzania has been a game-changer. It has accelerated my trade transactions, saving time and reducing hassles."
                </p>
                <footer className="flex items-center">
                  <img src="./src/assets/images/paul.png" alt="Paul Ondiso" className="w-12 h-12 rounded-full mr-4" />
                  <div>
                    <p className="font-bold">Paul Ondiso</p>
                    <p className="text-sm text-orange-300">Trader</p>
                  </div>
                </footer>
              </blockquote>
            </div>
          </div>

          {/* Right side - Sign Up Form */}
          <div className="w-full lg:w-1/2 flex items-center justify-center p-8 animate-slideIn">
            <div className="max-w-md w-full bg-white shadow-2xl rounded-[15px] p-10 
                            hover:shadow-orange-100 transition-all duration-300">
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
                                 ? 'bg-orange-500 text-white shadow-md'
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
                             focus:outline-none focus:ring-2 focus:ring-orange-500 
                             hover:border-orange-300 transition-all duration-200"
                  required
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="johndoe@gmail.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-[15px] focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-[15px] focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200"
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
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm Password"
                  autoComplete="new-password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-[15px] focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200"
                  required
                />
                <button type="submit" 
                        className="w-full bg-orange-500 text-white py-3 rounded-[15px] 
                                   hover:bg-orange-600 active:bg-orange-700 
                                   transform hover:scale-[1.01] transition-all duration-200 
                                   font-medium shadow-sm hover:shadow-md">
                  Sign Up
                </button>
              </form>

              <div className="mt-8">
                <button 
                  onClick={handleGoogleSignUp}
                  className="w-full border border-gray-300 text-gray-700 py-3 rounded-[15px] 
                             hover:bg-gray-50 hover:border-orange-300 transform hover:scale-[1.01] 
                             transition-all duration-200 flex items-center justify-center 
                             font-medium shadow-sm hover:shadow-md"
                >
                  <FaGoogle className="mr-2 text-orange-500" /> Sign up with Google
                </button>
              </div>

              <p className="mt-8 text-center text-gray-600">
                Already have an account? <Link to="/trader-login" className="text-orange-500 hover:underline font-medium">Login</Link>
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </Layout>
  );
}