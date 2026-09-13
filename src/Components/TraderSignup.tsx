import React, { useState, useCallback, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleAuthProvider, OAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import { signupUser, resolveOAuthUserRole, getAuthErrorMessage } from '../firebase/authService';
import AuthLayout from './Auth/AuthLayout';
import TextField from './Auth/TextField';
import PasswordField from './Auth/PasswordField';
import FormError from './Auth/FormError';
import OAuthButtons from './Auth/OAuthButtons';

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

  return (
    <AuthLayout>
      <h2 className="text-3xl sm:text-4xl font-bold mb-2 text-center text-gray-800">
        Create an account
      </h2>
      <p className="text-gray-600 mb-8 text-center">
        Welcome. Please enter your details.
      </p>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {formError && <FormError message={formError} />}

        <TextField
          id="fullName"
          name="fullName"
          label="Full name"
          autoComplete="name"
          value={formState.fullName}
          onChange={handleInputChange}
          error={fieldErrors.fullName}
        />

        <TextField
          id="email"
          name="email"
          type="email"
          label="Email"
          autoComplete="email"
          value={formState.email}
          onChange={handleInputChange}
          error={fieldErrors.email}
        />

        <PasswordField
          id="password"
          name="password"
          label="Password"
          autoComplete="new-password"
          value={formState.password}
          onChange={handleInputChange}
          show={showPassword}
          onToggleShow={() => setShowPassword(!showPassword)}
          error={fieldErrors.password}
          hint="At least 8 characters"
        />

        <PasswordField
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm password"
          autoComplete="new-password"
          value={formState.confirmPassword}
          onChange={handleInputChange}
          show={showPassword}
          onToggleShow={() => setShowPassword(!showPassword)}
          error={fieldErrors.confirmPassword}
        />

        <button
          type="submit"
          disabled={formState.isLoading}
          className="w-full py-3 px-4 bg-teal-600 text-white rounded-xl font-medium
                   hover:bg-teal-700 transform transition-all duration-200
                   hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {formState.isLoading ? 'Creating account...' : 'Create Account'}
        </button>

        <OAuthButtons onGoogle={handleGoogleSignUp} onApple={handleAppleSignUp} disabled={formState.isLoading} />
      </form>

      <p className="mt-8 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="text-teal-600 hover:underline font-medium">
          Login
        </Link>
      </p>
    </AuthLayout>
  );
};

export default React.memo(TraderSignup);
