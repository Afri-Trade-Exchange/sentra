import type { ReactNode } from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';

const auth = vi.hoisted(() => ({
  mounted: vi.fn(),
  user: null as { uid: string } | null,
  role: null as 'trader' | 'customs' | null,
}));

vi.mock('./Components/AuthContext', () => ({
  AuthProvider: ({ children }: { children: ReactNode }) => {
    auth.mounted();
    return children;
  },
  useAuth: () => ({ user: auth.user, role: auth.role, loading: false }),
}));
vi.mock('./Components/LoginPage', () => ({ default: () => <h1>Sign-in screen</h1> }));
vi.mock('./Components/Dashboard', () => ({ default: () => <h1>Trader workspace</h1> }));
vi.mock('./Components/CustomsDashboard', () => ({ default: () => <h1>Customs workspace</h1> }));
vi.mock('./Components/AppShell', () => ({
  default: ({ children }: { children: ReactNode }) => <main>{children}</main>,
}));

describe('public and account routes', () => {
  beforeEach(() => {
    auth.mounted.mockClear();
    auth.user = null;
    auth.role = null;
    vi.stubGlobal('matchMedia', () => ({
      matches: false,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('renders a public page without mounting the account provider', async () => {
    window.history.replaceState(null, '', '/about');
    render(<App />);

    expect(await screen.findByRole('heading', { name: /clearing customs shouldn't feel/i })).toBeVisible();
    expect(auth.mounted).not.toHaveBeenCalled();
  });

  it('redirects a signed-out dashboard visit to sign-in', async () => {
    window.history.replaceState(null, '', '/dashboard');
    render(<App />);

    expect(await screen.findByRole('heading', { name: 'Sign-in screen' })).toBeVisible();
    expect(window.location.pathname).toBe('/login');
    expect(auth.mounted).toHaveBeenCalled();
  });

  it('routes a trader to their workspace when they open the customs dashboard', async () => {
    auth.user = { uid: 'trader' };
    auth.role = 'trader';
    window.history.replaceState(null, '', '/customs-dashboard');
    render(<App />);

    expect(await screen.findByRole('heading', { name: 'Trader workspace' })).toBeVisible();
    expect(window.location.pathname).toBe('/dashboard');
  });
});
