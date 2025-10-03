import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { z } from 'zod';
import { auth } from '../firebase/firebaseConfig';
import { loginUser, UserRole } from '../firebase/authService';

const LoginSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters")
});

export type LoginFormData = z.infer<typeof LoginSchema>;

export const useLoginForm = () => {
  const navigate = useNavigate();
  const [formState, setFormState] = useState({
    data: { name: '', email: '', password: '' } as LoginFormData,
    errors: {} as Record<string, string>,
    isLoading: false
  });

  const [uiState, setUiState] = useState({
    showPassword: false,
    accountType: 'trader' as UserRole
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
        );
      }
      return {};
    }
  }, [formState.data]);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setFormState(prev => ({ ...prev, errors: validationErrors }));
      return;
    }

    setFormState(prev => ({ ...prev, isLoading: true }));

    try {
      const userRole = await loginUser({
        ...formState.data
      });
      
      navigate(userRole === 'trader' ? '/dashboard' : '/customs-dashboard');
    } catch (error) {
      setFormState(prev => ({
        ...prev,
        errors: { 
          submit: error instanceof Error ? error.message : 'An unexpected error occurred' 
        }
      }));
    } finally {
      setFormState(prev => ({ ...prev, isLoading: false }));
    }
  }, [formState.data, uiState.accountType, navigate, validateForm]);

  const handleGoogleSignIn = useCallback(async () => {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      navigate('/dashboard');
    } catch (error) {
      console.error('Google sign-in failed:', error);
      alert('Google sign-in failed. Please try again.');
    }
  }, [navigate]);

  return {
    formState,
    uiState,
    handleInputChange,
    handleSubmit,
    handleGoogleSignIn,
    setUiState
  };
};
