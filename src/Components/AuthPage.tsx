import React, { useState } from 'react';
import { FaEye, FaEyeSlash, FaGoogle, FaEnvelope, FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

type UserType = 'trader' | 'customs';
type AuthMode = 'signup' | 'login';

export default function AuthPage() {
  const [userType, setUserType] = useState<UserType>('trader');
  const [authMode, setAuthMode] = useState<AuthMode>('signup');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    
    // Simulating a successful login/signup
    const userData = {
      name: 'John Doe', // This would typically come from your backend
      email: formData.email,
    };

    // Store user data in localStorage
    localStorage.setItem('user', JSON.stringify(userData));

    // Navigate to the dashboard
    navigate('/dashboard');
  };

  const toggleUserType = (type: UserType) => {
    setUserType(type);
    setFormData({ email: '', password: '', confirmPassword: '' });
  };

  const toggleAuthMode = (mode: AuthMode) => {
    setAuthMode(mode);
    setFormData({ email: '', password: '', confirmPassword: '' });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-teal-100 to-teal-200">
      <div className="flex-grow flex flex-col md:flex-row items-center justify-center px-4 py-12">
        <div className="w-full md:w-1/2 max-w-md bg-white rounded-[20px] shadow-2xl overflow-hidden">
          <div className="p-8">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
              {authMode === 'signup' ? 'Join Afritrade' : 'Welcome Back'}
            </h2>
            <p className="text-gray-600 mb-8 text-center">
              {authMode === 'signup' ? 'Start your journey today.' : 'Log in to your account.'}
            </p>
            <div className="flex mb-6 bg-gray-100 rounded-[15px] p-1">
              {['trader', 'customs'].map((type) => (
                <button
                  key={type}
                  className={`flex-1 py-2 px-4 rounded-[15px] text-sm font-medium transition-all duration-200 ${
                    userType === type
                      ? 'bg-teal-500 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-200'
                  } capitalize`}
                  onClick={() => toggleUserType(type as UserType)}
                >
                  {type === 'trader' ? 'I\'m a Trader' : 'I\'m a Customs Officer'}
                </button>
              ))}
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  className="w-full pl-10 pr-4 py-3 rounded-[15px] bg-gray-100 border-2 border-transparent focus:border-teal-500 focus:bg-white focus:ring-0 text-sm transition-all duration-200"
                  required
                />
              </div>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Password"
                  className="w-full pl-10 pr-10 py-3 rounded-[15px] bg-gray-100 border-2 border-transparent focus:border-teal-500 focus:bg-white focus:ring-0 text-sm transition-all duration-200"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {authMode === 'signup' && (
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm Password"
                    className="w-full pl-10 pr-4 py-3 rounded-[15px] bg-gray-100 border-2 border-transparent focus:border-teal-500 focus:bg-white focus:ring-0 text-sm transition-all duration-200"
                    required
                  />
                </div>
              )}
              <button type="submit" className="w-full bg-teal-500 text-white py-3 rounded-[15px] hover:bg-teal-600 transition-colors duration-200 text-sm font-semibold">
                {authMode === 'signup' ? 'Create Account' : 'Log In'}
              </button>
            </form>
            <div className="mt-6">
              <button className="w-full border-2 border-gray-300 text-gray-700 bg-white py-3 rounded-[15px] hover:bg-gray-50 hover:border-teal-500 transition-all duration-200 text-sm font-medium flex items-center justify-center group">
                <FaGoogle className="mr-2 text-gray-500 group-hover:text-teal-500" /> 
                {authMode === 'signup' ? 'Sign up' : 'Log in'} with Google
              </button>
            </div>
            <p className="mt-8 text-center text-sm text-gray-600">
              {authMode === 'signup' ? 'Already have an account?' : 'Don\'t have an account?'}
              <button 
                onClick={() => toggleAuthMode(authMode === 'signup' ? 'login' : 'signup')} 
                className="text-teal-500 hover:underline font-medium ml-1"
              >
                {authMode === 'signup' ? 'Log in' : 'Sign up'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
