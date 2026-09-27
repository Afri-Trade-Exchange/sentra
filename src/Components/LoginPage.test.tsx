import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import LoginPage from './LoginPage';

const navigateMock = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return { ...actual, useNavigate: () => navigateMock };
});

const loginUserMock = vi.fn();
vi.mock('../firebase/authService', () => ({
  loginUser: (...args: unknown[]) => loginUserMock(...args),
  resolveOAuthUserRole: vi.fn(),
  getAuthErrorMessage: (_err: unknown, fallback: string) => fallback,
}));

vi.mock('../firebase/firebaseConfig', () => ({
  auth: {},
}));

vi.mock('firebase/auth', () => ({
  GoogleAuthProvider: vi.fn(),
  OAuthProvider: vi.fn(),
  signInWithPopup: vi.fn(),
}));

const renderComponent = () =>
  render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>
  );

describe('LoginPage', () => {
  beforeEach(() => {
    navigateMock.mockClear();
    loginUserMock.mockReset();
    localStorage.clear();
  });

  it('navigates to the trader dashboard on a successful trader login', async () => {
    loginUserMock.mockResolvedValueOnce('trader');
    const user = userEvent.setup();
    renderComponent();

    await user.type(screen.getByLabelText('Email address'), 'jane@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Sign in' }));

    await waitFor(() =>
      expect(loginUserMock).toHaveBeenCalledWith({ email: 'jane@example.com', password: 'password123' })
    );
    await waitFor(() => expect(navigateMock).toHaveBeenCalledWith('/dashboard'));
  });

  it('navigates to the customs dashboard for a customs role', async () => {
    loginUserMock.mockResolvedValueOnce('customs');
    const user = userEvent.setup();
    renderComponent();

    await user.type(screen.getByLabelText('Email address'), 'officer@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Sign in' }));

    await waitFor(() => expect(navigateMock).toHaveBeenCalledWith('/customs-dashboard'));
  });

  it('shows a generic error on failed login without leaking the cause', async () => {
    loginUserMock.mockRejectedValueOnce(new Error('auth/wrong-password'));
    const user = userEvent.setup();
    renderComponent();

    await user.type(screen.getByLabelText('Email address'), 'jane@example.com');
    await user.type(screen.getByLabelText('Password'), 'wrong');
    await user.click(screen.getByRole('button', { name: 'Sign in' }));

    expect(await screen.findByText('Invalid email or password. Please try again.')).toBeInTheDocument();
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it('persists the email when "Remember me" is checked', async () => {
    loginUserMock.mockResolvedValueOnce('trader');
    const user = userEvent.setup();
    renderComponent();

    await user.type(screen.getByLabelText('Email address'), 'jane@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.click(screen.getByLabelText('Remember me'));
    await user.click(screen.getByRole('button', { name: 'Sign in' }));

    await waitFor(() => expect(localStorage.getItem('rememberMe')).toBe('true'));
    expect(localStorage.getItem('email')).toBe('jane@example.com');
  });

  it('clears remembered credentials when "Remember me" is left unchecked', async () => {
    localStorage.setItem('rememberMe', 'true');
    localStorage.setItem('email', 'old@example.com');
    loginUserMock.mockResolvedValueOnce('trader');
    const user = userEvent.setup();
    renderComponent();

    // Pre-filled from localStorage by the remember-me effect.
    expect(screen.getByLabelText('Email address')).toHaveValue('old@example.com');

    await user.click(screen.getByLabelText('Remember me'));
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Sign in' }));

    await waitFor(() => expect(localStorage.getItem('rememberMe')).toBeNull());
    expect(localStorage.getItem('email')).toBeNull();
  });
});
