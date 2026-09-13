import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { GoogleAuthProvider, OAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import { loginUser, resolveOAuthUserRole, getAuthErrorMessage } from '../firebase/authService';
import AuthLayout from './Auth/AuthLayout';
import TextField from './Auth/TextField';
import PasswordField from './Auth/PasswordField';
import FormError from './Auth/FormError';
import OAuthButtons from './Auth/OAuthButtons';

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
    <AuthLayout>
      <h2 className="text-3xl sm:text-4xl font-bold mb-2 text-center text-gray-800">
        {isCustomsLogin ? 'Customs Officer Sign In' : 'Welcome back'}
      </h2>
      <p className="text-gray-600 mb-8 text-center">
        {isCustomsLogin
          ? 'Sign in to scan and clear consignments.'
          : 'Sign in to manage your consignments.'}
      </p>

      <form className="space-y-5" onSubmit={handleSubmit}>
        {error && <FormError message={error} />}

        <TextField
          id="email"
          name="email"
          type="email"
          label="Email address"
          required
          autoComplete="email"
          placeholder="johndoe@example.com"
          value={formData.email}
          onChange={e => setFormData({ ...formData, email: e.target.value })}
        />

        <PasswordField
          id="password"
          name="password"
          label="Password"
          required
          autoComplete="current-password"
          value={formData.password}
          onChange={e => setFormData({ ...formData, password: e.target.value })}
          show={showPassword}
          onToggleShow={() => setShowPassword(!showPassword)}
        />

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

        <OAuthButtons onGoogle={handleGoogleSignIn} onApple={handleAppleSignIn} disabled={loading} />
      </form>

      <p className="mt-8 text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <Link to="/trader-signup" className="text-teal-600 hover:underline font-medium">
          Sign up
        </Link>
      </p>
    </AuthLayout>
  );
};

export default LoginPage;
