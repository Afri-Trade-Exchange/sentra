import { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom'
import './index.css'
import LandingPage from './Components/Landing/LandingPage'
import TraderSignup from './Components/TraderSignup'
import ContactPage from './Components/ContactPage'
import AboutPage from './Components/AboutPage'
import PricingPage from './Components/PricingPage'
import BlogPage from './Components/BlogPage'
import TermsPage from './Components/TermsPage'
import PrivacyPage from './Components/PrivacyPage'
import Layout from './Components/Layout'
import AppShell from './Components/AppShell'
import ErrorBoundary from './Components/ErrorBoundary'
import Dashboard from './Components/Dashboard'
import CustomsDashboard from './Components/CustomsDashboard'
import { AuthProvider } from './Components/AuthContext'
import { ThemeProvider } from './Components/ThemeContext'
import ProtectedRoute from './Components/ProtectedRoute'
import LoginPage from './Components/LoginPage'
import ForgotPassword from './Components/ForgotPassword'
import Settings from './Components/Settings'

const Footer = lazy(() => import('./Components/Footer'));

// Logged-in app pages get a left-sidebar shell instead of the marketing
// top nav, since a persistent top nav for signed-out visitors doesn't
// belong on an authenticated dashboard.
const APP_SHELL_PREFIXES = ['/dashboard', '/customs-dashboard', '/settings'];

function AppRoutes() {
  const location = useLocation();
  const useAppShell = APP_SHELL_PREFIXES.some((prefix) => location.pathname.startsWith(prefix));

  const routes = (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/trader-signup" element={<TraderSignup />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/customs-login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute requiredRole="trader">
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customs-dashboard"
        element={
          <ProtectedRoute requiredRole="customs">
            <CustomsDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
      {/* Add other routes as needed */}
    </Routes>
  );

  if (useAppShell) {
    return <AppShell>{routes}</AppShell>;
  }

  return (
    <Layout>
      {routes}
      <Footer />
    </Layout>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ErrorBoundary>
          <Router>
            <Suspense fallback={<div>Loading...</div>}>
              <div className="App">
                <AppRoutes />
              </div>
            </Suspense>
          </Router>
        </ErrorBoundary>
      </AuthProvider>
    </ThemeProvider>
  )
}
