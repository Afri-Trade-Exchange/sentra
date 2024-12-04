import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaGoogle } from 'react-icons/fa';
import Footer from '../Components/Footer'; // Import the Footer component

export default function TraderSignup() {
  const [showPassword, setShowPassword] = useState(false);
  const [accountType, setAccountType] = useState('trader');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Add form validation and submission logic here
    console.log('Form submitted:', formData);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-teal-100 to-teal-200">
      <div className="flex-grow flex flex-col md:flex-row items-center justify-center px-4 py-12">
        <div className="w-full md:w-1/2 max-w-md bg-white rounded-[20px] shadow-2xl overflow-hidden">
          <div className="p-8">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Join Afritrade</h2>
            <p className="text-gray-600 mb-8 text-center">Start your trading journey today.</p>
            <div className="flex mb-6 bg-gray-100 rounded-[15px] p-1">
              {['trader', 'customs'].map((type) => (
                <button
                  key={type}
                  className={`flex-1 py-2 px-4 rounded-[15px] text-sm font-medium transition-all duration-200 ${
                    accountType === type
                      ? 'bg-teal-500 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-200'
                  } capitalize`}
                  onClick={() => setAccountType(type)}
                >
                  {type}
                </button>
              ))}
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  className="w-full px-4 py-3 rounded-[15px] bg-gray-100 border-transparent focus:border-teal-500 focus:bg-white focus:ring-0 text-sm"
                  required
                />
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Password"
                  className="w-full px-4 py-3 rounded-[15px] bg-gray-100 border-transparent focus:border-teal-500 focus:bg-white focus:ring-0 text-sm"
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
              <div>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm Password"
                  className="w-full px-4 py-3 rounded-[15px] bg-gray-100 border-transparent focus:border-teal-500 focus:bg-white focus:ring-0 text-sm"
                  required
                />
              </div>
              <button type="submit" className="w-full bg-teal-500 text-white py-3 rounded-[15px] hover:bg-teal-600 transition-colors duration-200 text-sm font-semibold">
                Create Account
              </button>
            </form>
            <div className="mt-6">
              <button className="w-full border border-gray-300 text-gray-700 bg-white py-3 rounded-[15px] hover:bg-gray-50 transition-colors duration-200 text-sm font-medium flex items-center justify-center">
                <FaGoogle className="mr-2" /> Sign up with Google
              </button>
            </div>
            <p className="mt-8 text-center text-sm text-gray-600">
              Already have an account? <Link to="/login" className="text-teal-500 hover:underline font-medium">Log in</Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
