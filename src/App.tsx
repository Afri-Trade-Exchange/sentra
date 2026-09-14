import { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './index.css'
import LandingPage from './Components/Landing/LandingPage'
import TraderSignup from './Components/TraderSignup'
import ContactPage from './Components/ContactPage'
import AboutPage from './Components/AboutPage'
import PricingPage from './Components/PricingPage'
import BlogPage from './Components/BlogPage'
import Layout from './Components/Layout'
import ErrorBoundary from './Components/ErrorBoundary'
import Dashboard from './Components/Dashboard'
import CustomsDashboard from './Components/CustomsDashboard'
import { AuthProvider } from './Components/AuthContext'
import ProtectedRoute from './Components/ProtectedRoute'
import LoginPage from './Components/LoginPage'
import ForgotPassword from './Components/ForgotPassword'
import Settings from './Components/Settings'

const Footer = lazy(() => import('./Components/Footer'));

export default function App() {
  return (
    <AuthProvider>
      <ErrorBoundary>
        <Router>
          <Suspense fallback={<div>Loading...</div>}>
            <div className="App">
              <Layout>
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
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/customs-dashboard"
                    element={
                      <ProtectedRoute>
                        <CustomsDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/settings" element={<Settings />} />
                  {/* Add other routes as needed */}
                </Routes>
                <Footer />
              </Layout>
            </div>
          </Suspense>
        </Router>
      </ErrorBoundary>
    </AuthProvider>
  )
}
