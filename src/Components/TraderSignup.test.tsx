import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import TraderSignup from './TraderSignup';

const navigateMock = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return { ...actual, useNavigate: () => navigateMock };
});

const signupUserMock = vi.fn();
vi.mock('../firebase/authService', () => ({
  signupUser: (...args: unknown[]) => signupUserMock(...args),
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
      <TraderSignup />
    </MemoryRouter>
  );

const fillAndSubmit = async (
  user: ReturnType<typeof userEvent.setup>,
  values: { fullName?: string; email?: string; password?: string; confirmPassword?: string }
) => {
  if (values.fullName !== undefined) {
    await user.type(screen.getByLabelText('Full name'), values.fullName);
  }
  if (values.email !== undefined) {
    await user.type(screen.getByLabelText('Email'), values.email);
  }
  if (values.password !== undefined) {
    await user.type(screen.getByLabelText('Password'), values.password);
  }
  if (values.confirmPassword !== undefined) {
    await user.type(screen.getByLabelText('Confirm password'), values.confirmPassword);
  }
  await user.click(screen.getByRole('button', { name: 'Create Account' }));
};

describe('TraderSignup validation', () => {
  beforeEach(() => {
    navigateMock.mockClear();
    signupUserMock.mockReset();
  });

  it('shows required-field errors when submitted empty', async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.click(screen.getByRole('button', { name: 'Create Account' }));

    expect(await screen.findByText('Full name is required')).toBeInTheDocument();
    expect(screen.getByText('Email is required')).toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();
    expect(screen.getByText('Please confirm your password')).toBeInTheDocument();
    expect(signupUserMock).not.toHaveBeenCalled();
  });

  it('flags an invalid email format', async () => {
    const user = userEvent.setup();
    renderComponent();

    await fillAndSubmit(user, {
      fullName: 'Jane Doe',
      email: 'not-an-email',
      password: 'password123',
      confirmPassword: 'password123',
    });

    expect(await screen.findByText('Invalid email format')).toBeInTheDocument();
    expect(signupUserMock).not.toHaveBeenCalled();
  });

  it('flags a password under 8 characters', async () => {
    const user = userEvent.setup();
    renderComponent();

    await fillAndSubmit(user, {
      fullName: 'Jane Doe',
      email: 'jane@example.com',
      password: 'short',
      confirmPassword: 'short',
    });

    expect(await screen.findByText('Password must be at least 8 characters')).toBeInTheDocument();
    expect(signupUserMock).not.toHaveBeenCalled();
  });

  it('flags mismatched password confirmation', async () => {
    const user = userEvent.setup();
    renderComponent();

    await fillAndSubmit(user, {
      fullName: 'Jane Doe',
      email: 'jane@example.com',
      password: 'password123',
      confirmPassword: 'password456',
    });

    expect(await screen.findByText('Passwords do not match')).toBeInTheDocument();
    expect(signupUserMock).not.toHaveBeenCalled();
  });

  it('clears a field error as soon as the user edits that field', async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.click(screen.getByRole('button', { name: 'Create Account' }));
    expect(await screen.findByText('Full name is required')).toBeInTheDocument();

    await user.type(screen.getByLabelText('Full name'), 'J');
    expect(screen.queryByText('Full name is required')).not.toBeInTheDocument();
  });

  it('submits and navigates to the dashboard once the form is valid', async () => {
    signupUserMock.mockResolvedValueOnce('trader');
    const user = userEvent.setup();
    renderComponent();

    await fillAndSubmit(user, {
      fullName: 'Jane Doe',
      email: 'jane@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    });

    await waitFor(() =>
      expect(signupUserMock).toHaveBeenCalledWith({
        email: 'jane@example.com',
        password: 'password123',
        name: 'Jane Doe',
        role: 'trader',
      })
    );
    await waitFor(() => expect(navigateMock).toHaveBeenCalledWith('/dashboard'));
  });

  it('shows a form-level error when signup fails', async () => {
    signupUserMock.mockRejectedValueOnce(new Error('boom'));
    const user = userEvent.setup();
    renderComponent();

    await fillAndSubmit(user, {
      fullName: 'Jane Doe',
      email: 'jane@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    });

    expect(await screen.findByText('Failed to create account. Please try again.')).toBeInTheDocument();
    expect(navigateMock).not.toHaveBeenCalled();
  });
});
