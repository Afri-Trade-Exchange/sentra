import React, { useState, useCallback, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaGoogle } from 'react-icons/fa';
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { z } from 'zod';
import Layout from './Layout';
import Footer from './Footer';
import { auth } from '../firebase/firebaseConfig';
import { loginUser, UserRole } from '../firebase/authService';

const LoginSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters")
});

type LoginFormData = z.infer<typeof LoginSchema>;

export default function TraderLogin() {
  const navigate = useNavigate();
  const [formState, setFormState] = useState<{
    data: LoginFormData;
    errors: Record<string, string>;
    isLoading: boolean;
  }>({
    data: { name: '', email: '', password: '' },
    errors: {},
    isLoading: false
  });

  const [uiState, setUiState] = useState<{
    showPassword: boolean;
    accountType: UserRole;
  }>({
    showPassword: false,
    accountType: 'trader'
  });

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      data: { ...prev.data, [name]: value },
      errors: {}
    }));
  }, []);

  const validateForm = useCallback(() => {
    try {
      LoginSchema.parse(formState.data);
      return {};
    } catch (error) {
      if (error instanceof z.ZodError) {
        return Object.fromEntries(
          Object.entries(error.flatten().fieldErrors)
            .map(([key, value]) => [key, value?.[0] || ''])
        ) as Record<string, string>;
      }
      return {};
    }
  }, [formState.data]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setFormState(prev => ({ ...prev, errors: validationErrors }));
      return;
    }

    setFormState(prev => ({ ...prev, isLoading: true }));

    try {
      const userRole = await loginUser({
        ...formState.data,
        role: uiState.accountType
      });
      
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

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate('/dashboard');
    } catch (error) {
      console.error('Google sign-in failed:', error);
      alert('Google sign-in failed. Please try again.');
    }
  };

  return (
    <Layout>
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow flex bg-gray-100">
          <div className="hidden lg:block w-1/2 bg-cover bg-center relative" style={{ backgroundImage: "url('./src/assets/images/paul.png')" }}>
            <div className="absolute inset-0 bg-gradient-to-br from-teal-600 to-teal-900 bg-opacity-80 flex flex-col justify-center p-12 text-white">
              <h2 className="text-6xl font-bold mb-6 leading-tight">
                Streamline Your <br />
                <span className="text-teal-300">Customs Process</span>
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
                    <p className="text-sm text-teal-300">Trader</p>
                  </div>
                </footer>
              </blockquote>
            </div>
          </div>

          <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
            <div className="max-w-md w-full bg-white shadow-2xl rounded-[15px] p-10">
              <h2 className="text-4xl font-bold mb-8 text-center text-gray-800">Login to Your Account</h2>
              <p className="text-gray-600 mb-8 text-center">Welcome Back. Please enter your details.</p>

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

              <form onSubmit={handleSubmit} className="space-y-6">
                <input
                  type="text"
                  name="name"
                  value={formState.data.name}
                  onChange={handleInputChange}
                  placeholder="Full Name"
                  className={`w-full px-4 py-3 border rounded-[15px] ${
                    formState.errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {formState.errors.name && (
                  <p className="text-red-500 text-sm">{formState.errors.name}</p>
                )}
                
                <input
                  type="email"
                  id="email-input"
                  aria-label="Email Address"
                  aria-required="true"
                  aria-invalid={formState.errors.email ? "true" : "false"}
                  aria-describedby="email-error"
                  name="email"
                  value={formState.data.email}
                  onChange={handleInputChange}
                  placeholder="Enter Your Email"
                  className={`w-full px-4 py-3 border rounded-[15px] ${
                    formState.errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {formState.errors.email && (
                  <p className="text-red-500 text-sm">{formState.errors.email}</p>
                )}
                
                <div className="relative">
                  <input
                    type={uiState.showPassword ? "text" : "password"}
                    name="password"
                    value={formState.data.password}
                    onChange={handleInputChange}
                    placeholder="Password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-[15px] focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 rounded-[15px] text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    onClick={() => setUiState(prev => ({ ...prev, showPassword: !prev.showPassword }))}
                  >
                    {uiState.showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <button 
                  type="submit"
                  disabled={formState.isLoading}
                  className="w-full bg-teal-500 text-white py-3 rounded-[15px] hover:bg-teal-600"
                >
                  {formState.isLoading ? 'Logging In...' : 'Login'}
                </button>
              </form>

              <div className="mt-8">
                <button onClick={handleGoogleSignIn} className="w-full border border-gray-300 text-gray-700 py-3 rounded-[15px] hover:bg-gray-50 transition-all duration-200 flex items-center justify-center font-medium">
                  <FaGoogle className="mr-2" /> Sign in with Google
                </button>
              </div>

              <p className="mt-8 text-center text-gray-600">
                Don't have an account? <Link to="/login" className="text-teal-500 hover:underline font-medium">Sign Up</Link>
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </Layout>
  );
}
