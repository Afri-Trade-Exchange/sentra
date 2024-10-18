import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaGoogle } from 'react-icons/fa';
import Layout from './Layout';
import Footer from './Footer';
import { GoogleAuthProvider, signInWithPopup} from "firebase/auth";
import { auth } from '../../firebase/firebaseConfig';

interface LoginFormData {
  name: string;
  email: string;
  password: string;
}

export default function TraderLogin() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [accountType, setAccountType] = useState('trader');
  const [formData, setFormData] = useState<LoginFormData>({
    name: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate('/dashboard');
    } catch (error) {
      console.error('Google sign-in failed:', error);
      alert('Google sign-in failed. Please try again.');
    }
  }

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      errors.email = 'Invalid email format';
    }
    
    if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      console.log('Form submitted:', formData);
      // Perform signup/login logic here
      // For example:
      // const response = await signUpUser(formData);
      // if (response.success) {
      //   // Redirect to dashboard
      navigate('/dashboard');
      // }
      await loginUser(formData);
      navigate('/dashboard');
    } catch (error) {
      setErrors({
        submit: error instanceof Error 
          ? error.message 
          : 'An unexpected error occurred'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow flex bg-gray-100">
          {/* Left side - Image and Quote */}
          <div className="hidden lg:block w-1/2 bg-cover bg-center relative" style={{ backgroundImage: "url('./src/assets/images/paul.png')" }}>
            <div className="absolute inset-0 bg-gradient-to-br from-orange-600 to-orange-900 bg-opacity-80 flex flex-col justify-center p-12 text-white">
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
          <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
            <div className="max-w-md w-full bg-white shadow-2xl rounded-[15px] p-10">
              <h2 className="text-4xl font-bold mb-8 text-center text-gray-800">Login to Your Account</h2>
              <p className="text-gray-600 mb-8 text-center">Welcome Back. Please enter your details.</p>

              {/* Account Type Selector */}
              <div className="flex mb-8 bg-gray-100 rounded-[15px] p-1">
                {['trader', 'customs'].map((type) => (
                  <button
                    key={type}
                    className={`flex-1 py-3 px-4 rounded-[15px] text-sm font-medium transition-all duration-200 ${
                      accountType === type
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-[15px] focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200"
                  required
                />
                <input
                  type="email"
                  id="email-input"
                  aria-label="Email Address"
                  aria-required="true"
                  aria-invalid={!!errors.email}
                  aria-describedby="email-error"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter Your Email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-[15px] focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200"
                  required
                />
                {errors.email && (
                  <span 
                    id="email-error" 
                    className="text-red-500 text-sm mt-1"
                  >
                    {errors.email}
                  </span>
                )}
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Password"
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
                <button type="submit" className="w-full bg-orange-500 text-white py-3 rounded-[15px] hover:bg-orange-600 transition-all duration-200 font-medium">
                  Login Up
                </button>
              </form>

              <div className="mt-8">
                <button onClick={handleGoogle} className="w-full border border-gray-300 text-gray-700 py-3 rounded-[15px] hover:bg-gray-50 transition-all duration-200 flex items-center justify-center font-medium">
                  <FaGoogle className="mr-2" /> Sign up with Google
                </button>
              </div>

              <p className="mt-8 text-center text-gray-600">
                Don't have an account? <Link to="/login" className="text-orange-500 hover:underline font-medium">Sign Up</Link>
              </p>
            </div>
          </div>
        </div>
        <Footer /> {/* Add the Footer component here */}
      </div>
    </Layout>
  );
}
