import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaApple, FaEye, FaEyeSlash } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { GoogleAuthProvider, OAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import { loginUser, resolveOAuthUserRole, getAuthErrorMessage } from '../firebase/authService';
import HeroSection from './HeroSection';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isCustomsLogin = location.pathname === '/customs-login';

  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize remember me state from local storage
  useEffect(() => {
    const rememberMe = localStorage.getItem('rememberMe') === 'true';
    if (rememberMe) {
      const email = localStorage.getItem('email') || '';
      setFormData(prev => ({ ...prev, email, rememberMe }));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const role = await loginUser({ email: formData.email, password: formData.password });
      if (formData.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem('email', formData.email);
      } else {
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('email');
      }
      navigate(role === 'customs' ? '/customs-dashboard' : '/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);
      const provider = new GoogleAuthProvider();
      const { user } = await signInWithPopup(auth, provider);
      const role = await resolveOAuthUserRole(user);
      navigate(role === 'customs' ? '/customs-dashboard' : '/dashboard');
    } catch (err) {
      console.error('Google sign-in error:', err);
      setError(getAuthErrorMessage(err, 'Failed to sign in with Google. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);
      const provider = new OAuthProvider('apple.com');
      const { user } = await signInWithPopup(auth, provider);
      const role = await resolveOAuthUserRole(user);
      navigate(role === 'customs' ? '/customs-dashboard' : '/dashboard');
    } catch (err) {
      console.error('Apple sign-in error:', err);
      setError(getAuthErrorMessage(err, 'Failed to sign in with Apple. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow flex bg-stone-100">
          {/* Left side - HeroSection */}
          <div className="hidden lg:flex lg:w-2/5">
            <HeroSection />
          </div>

          {/* Right side - Sign In Form */}
          <div className="w-full lg:w-3/5 flex items-center justify-center bg-white p-8">
            <div className="w-full max-w-md py-10 sm:py-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-2 text-center text-gray-800">
                {isCustomsLogin ? 'Customs Officer Sign In' : 'Welcome back'}
              </h2>
              <p className="text-gray-600 mb-8 text-center">
                {isCustomsLogin
                  ? 'Sign in to scan and clear consignments.'
                  : 'Sign in to manage your consignments.'}
              </p>

              {error && (
                <div className="p-4 mb-6 text-red-700 bg-red-100 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl
                             focus:ring-2 focus:ring-teal-500 focus:border-transparent
                             transition-all duration-200"
                    placeholder="johndoe@example.com"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoComplete="current-password"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl
                               focus:ring-2 focus:ring-teal-500 focus:border-transparent
                               transition-all duration-200"
                      placeholder="Password"
                      value={formData.password}
                      onChange={e => setFormData({ ...formData, password: e.target.value })}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                      checked={formData.rememberMe}
                      onChange={e => setFormData({ ...formData, rememberMe: e.target.checked })}
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                      Remember me
                    </label>
                  </div>

                  <Link to="/forgot-password" className="text-sm font-medium text-teal-600 hover:text-teal-700">
                    Forgot your password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-teal-600 text-white rounded-xl font-medium
                           hover:bg-teal-700 transform transition-all duration-200
                           hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {loading ? 'Signing in...' : 'Sign in'}
                </button>

                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-4 text-sm bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3
                             border border-gray-300 rounded-xl font-medium
                             text-gray-700 bg-white hover:bg-gray-50 transform
                             transition-all duration-200 hover:scale-[1.02] disabled:opacity-50"
                  >
                    <FcGoogle className="text-lg" /> Google
                  </button>
                  <button
                    type="button"
                    onClick={handleAppleSignIn}
                    disabled={loading}
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
                Don't have an account?{' '}
                <Link to="/trader-signup" className="text-teal-600 hover:underline font-medium">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
  );
};

export default LoginPage;
