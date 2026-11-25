import { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LandingPage from './Components/Landing/LandingPage';
import ContactPage from './Components/ContactPage';
import AboutPage from './Components/AboutPage';
import PricingPage from './Components/PricingPage';
import BlogPage from './Components/BlogPage';
import TermsPage from './Components/TermsPage';
import PrivacyPage from './Components/PrivacyPage';
import ErrorBoundary from './Components/ErrorBoundary';
import { ThemeProvider } from './Components/ThemeContext';
import PublicLayout from './routes/PublicLayout';

const AccountLayout = lazy(() => import('./routes/AccountLayout'));
const WorkspaceLayout = lazy(() => import('./routes/WorkspaceLayout'));
const TraderSignup = lazy(() => import('./Components/TraderSignup'));
const LoginPage = lazy(() => import('./Components/LoginPage'));
const ForgotPassword = lazy(() => import('./Components/ForgotPassword'));
const Dashboard = lazy(() => import('./Components/Dashboard'));
const CustomsDashboard = lazy(() => import('./Components/CustomsDashboard'));
const Settings = lazy(() => import('./Components/Settings'));

export default function App() {
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <BrowserRouter>
          <div className="App">
            <Suspense fallback={<div role="status">Loading…</div>}>
              <Routes>
                <Route element={<PublicLayout />}>
                  <Route index element={<LandingPage />} />
                  <Route path="contact" element={<ContactPage />} />
                  <Route path="about" element={<AboutPage />} />
                  <Route path="pricing" element={<PricingPage />} />
                  <Route path="blog" element={<BlogPage />} />
                  <Route path="terms" element={<TermsPage />} />
                  <Route path="privacy" element={<PrivacyPage />} />
                  <Route path="*" element={null} />
                </Route>

                <Route element={<AccountLayout />}>
                  <Route element={<PublicLayout />}>
                    <Route path="trader-signup" element={<TraderSignup />} />
                    <Route path="login" element={<LoginPage />} />
                    <Route path="customs-login" element={<LoginPage />} />
                    <Route path="forgot-password" element={<ForgotPassword />} />
                  </Route>
                  <Route element={<WorkspaceLayout requiredRole="trader" />}>
                    <Route path="dashboard" element={<Dashboard />} />
                  </Route>
                  <Route element={<WorkspaceLayout requiredRole="customs" />}>
                    <Route path="customs-dashboard" element={<CustomsDashboard />} />
                  </Route>
                  <Route element={<WorkspaceLayout />}>
                    <Route path="settings" element={<Settings />} />
                  </Route>
                </Route>
              </Routes>
            </Suspense>
          </div>
        </BrowserRouter>
      </ErrorBoundary>
    </ThemeProvider>
  );
}
