import { Suspense, lazy } from 'react'
import { FiSearch } from 'react-icons/fi'
import './index.css'
import TraderSignup from './Components/TraderSignup'
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom'
import ContactPage from './Components/ContactPage'
import Layout from './Components/Layout'
import ErrorBoundary from './Components/ErrorBoundary'
import Dashboard from './Components/Dashboard'
import { useState } from 'react';
import CustomsDashboard from './Components/CustomsDashboard';
import { AuthProvider } from './Components/AuthContext';
import ProtectedRoute from './Components/ProtectedRoute';
import TraderLogin from './Components/TraderLogin';
import { Dialog } from '@headlessui/react'
import { FaClock, FaShieldAlt, FaChartLine, FaBriefcase, FaUserShield, FaFileUpload, FaQrcode, FaCheckCircle, FaArrowRight } from 'react-icons/fa';
import './Components/LandingPage.css';
import Settings from './Components/Settings';
import heroImg from './assets/images/customs-port-2.jpg';
import accelerLogo from './assets/images/acceler.png';
import kuehneNagelLogo from './assets/images/kuehne-nagel.png';
import alslLogo from './assets/images/ALSL-Logo.png';
import loriLogo from './assets/images/Lori.png';
import omlAfricaLogo from './assets/images/omlafrica.png';
import siginonLogo from './assets/images/Siginon-Group.png';
const Footer = lazy(() => import('./Components/Footer'));

const trustedLogos = [
  { src: accelerLogo, alt: 'Acceler' },
  { src: kuehneNagelLogo, alt: 'Kuehne + Nagel' },
  { src: alslLogo, alt: 'ALSL' },
  { src: loriLogo, alt: 'Lori' },
  { src: omlAfricaLogo, alt: 'Omla Africa' },
  { src: siginonLogo, alt: 'Siginon Group' },
];

// Add this interface for order information
interface OrderInfo {
  orderNumber: string;
  status: 'In Transit' | 'Delivered' | 'Pending';
  location: string;
  lastUpdate: string;
  packageType?: string;
  estimatedDelivery?: string;
  sender?: string;
  origin?: string;
  recipient?: string;
  destination?: string;
  trackingHistory?: Array<{
    status: string;
    location: string;
    timestamp: string;
  }>;
}

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
                  <Route path="/login" element={<TraderLogin />} />
                  <Route path="/customs-login" element={<TraderLogin />} />
                  <Route path="/contact" element={<ContactPage />} />
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

function LandingPage () {
  const navigate = useNavigate();
  const [orderNumber, setOrderNumber] = useState('');
  const [orderInfo, setOrderInfo] = useState<OrderInfo | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchOrderInfo = async (orderNumber: string) => {
    setIsSearching(true);
    // Simulate API call - I will replace with actual API call
    if (orderNumber.match(/^ORD-\d{3}$/)) {
      return {
        orderNumber,
        status: "In Transit" as const,
        location: "Mombasa Port",
        lastUpdate: new Date().toLocaleDateString()
      };
    }
    return null;
  };

  const handleSearch = async () => {
    const info = await fetchOrderInfo(orderNumber);
    setOrderInfo(info);
    setIsSearching(false);
    if (info) setIsModalOpen(true);
  };

  return (
    <div 
      className="min-h-screen bg-stone-100 text-gray-800 font-['Montserrat'] flex flex-col relative"
    >

      {/* Subtle background pattern */}
      <div className="absolute inset-0 z-0 opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="shipping-container" x="0" y="0" width="100" height="50" patternUnits="userSpaceOnUse">
              <rect width="95" height="45" x="2.5" y="2.5" fill="none" stroke="#888" strokeWidth="0.5"/>
              <line x1="0" y1="25" x2="100" y2="25" stroke="#888" strokeWidth="0.5"/>
            </pattern>
            <pattern id="trade-routes" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
              <path d="M0,100 Q100,0 200,100 T400,100" fill="none" stroke="#888" strokeWidth="0.5"/>
              <path d="M0,150 Q100,50 200,150 T400,150" fill="none" stroke="#888" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#shipping-container)"/>
          <rect width="100%" height="100%" fill="url(#trade-routes)"/>
        </svg>
      </div>

      {/* Hero — full-bleed, extends up behind the floating header */}
      <div className="relative -mt-24 min-h-[600px] sm:min-h-[660px] flex items-start overflow-hidden">
        <img
          src={heroImg}
          alt="Aerial view of stacked shipping containers at a busy port"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 max-w-6xl mx-auto px-4 pt-24 w-full">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-light mb-4 leading-tight text-white">
              Clear Customs <span className="font-semibold text-teal-300">40% Faster</span><br />
              and Keep Your Business Moving.
            </h1>
            <p className="text-gray-200 mb-6">
              One platform for traders and customs officers across Africa — upload your documents, get a QR code, and clear the border without the paperwork chase.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                type="button"
                onClick={() => navigate('/trader-signup')}
                className="px-8 sm:px-12 py-3 text-white bg-white/10 border border-white/40 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-colors font-medium"
              >
                How others use it
              </button>
              <button
                type="button"
                onClick={() => navigate('/trader-signup')}
                className="px-8 sm:px-12 py-3 text-white bg-teal-600 rounded-xl hover:bg-teal-700 transition-colors font-medium"
              >
                Try for free
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 relative z-10">

        {/* Choose your path */}
        <div className="mb-20">
          <h2 className="text-center text-2xl font-medium mb-2">Wherever you're joining us from, you're in the right place</h2>
          <p className="text-center text-gray-600 mb-8">Pick the side you're on and we'll get you set up.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="bg-stone-50 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center mb-4">
                <FaBriefcase className="text-teal-600 text-lg" />
              </div>
              <h3 className="text-lg font-medium mb-2">I'm a Trader</h3>
              <p className="text-gray-600 mb-5">Upload your documents once, get a QR code, and clear customs without the paperwork chase.</p>
              <button
                type="button"
                onClick={() => navigate('/trader-signup')}
                className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium"
              >
                Get started as a trader <FaArrowRight className="text-sm" />
              </button>
            </div>
            <div className="bg-stone-50 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center mb-4">
                <FaUserShield className="text-teal-600 text-lg" />
              </div>
              <h3 className="text-lg font-medium mb-2">I'm a Customs Officer</h3>
              <p className="text-gray-600 mb-5">Scan a trader's QR code at the border to instantly verify their documents and clear the consignment.</p>
              <button
                type="button"
                onClick={() => navigate('/customs-login')}
                className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium"
              >
                Sign in as an officer <FaArrowRight className="text-sm" />
              </button>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="mb-20">
          <h2 className="text-center text-2xl font-medium mb-10">How it works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {[
              { icon: FaFileUpload, title: 'Upload your documents', body: "Submit your import or export paperwork once, right from your dashboard." },
              { icon: FaQrcode, title: 'Get your QR code', body: 'We generate a secure QR code tied to your verified consignment.' },
              { icon: FaCheckCircle, title: 'Cleared at the border', body: 'The officer scans your code and pulls up everything instantly.' },
            ].map((step, index) => (
              <div key={step.title} className="text-center">
                <div className="w-14 h-14 rounded-full bg-teal-50 flex items-center justify-center mx-auto mb-4">
                  <step.icon className="text-teal-600 text-xl" />
                </div>
                <p className="text-xs font-medium text-teal-600 mb-1">STEP {index + 1}</p>
                <h3 className="text-lg font-medium mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Feature highlights */}
        <div className="mb-20">
          <h2 className="text-center text-2xl font-medium mb-10">Why traders choose Sentra</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-3xl mx-auto">
            <div className="bg-stone-50 p-6 rounded-xl shadow-sm text-center flex flex-col items-center">
              <div className="text-teal-600 text-xl font-medium mb-3">
                <FaClock className="inline-block mr-2" /> Fast Processing
              </div>
              <p className="text-gray-600">Clear customs in half the time with our streamlined digital process</p>
            </div>
            <div className="bg-stone-50 p-6 rounded-xl shadow-sm text-center flex flex-col items-center">
              <div className="text-teal-600 text-xl font-medium mb-3">
                <FaShieldAlt className="inline-block mr-2" /> Secure & Compliant
              </div>
              <p className="text-gray-600">100% compliance with customs regulations and secure document handling</p>
            </div>
            <div className="bg-stone-50 p-6 rounded-xl shadow-sm text-center flex flex-col items-center">
              <div className="text-teal-600 text-xl font-medium mb-3">
                <FaChartLine className="inline-block mr-2" /> Real-time Tracking
              </div>
              <p className="text-gray-600">Monitor your shipments and customs clearance status in real-time</p>
            </div>
          </div>
        </div>

        {/* Track an existing shipment */}
        <div className="max-w-2xl mx-auto mb-20 bg-stone-50 rounded-2xl shadow-sm p-8 text-center">
          <h2 className="text-lg font-medium mb-1">Already shipping with us?</h2>
          <p className="text-gray-600 mb-4 text-sm">Track your order below.</p>
          <div className="flex flex-col gap-4">
            <div className="flex items-center bg-gray-50 rounded-2xl overflow-hidden border border-gray-200">
              <div className="flex-grow flex items-center px-6">
                <FiSearch className="text-gray-400 text-xl mr-3" aria-hidden="true" />
                <input
                  type="text"
                  className="w-full py-4 text-base bg-transparent focus:outline-none"
                  aria-label="Search orders"
                  placeholder="Search order, e.g. ORD-001"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <button
                type="button"
                className="bg-teal-600 text-white px-8 py-4 flex items-center gap-2 hover:bg-teal-700 transition-colors font-medium"
                onClick={handleSearch}
              >
                <span>Track Shipment</span>
                <FiSearch />
              </button>
            </div>

            {/* Order Information Display */}
            {isSearching && (
              <div className="text-center text-gray-600">
                Searching...
              </div>
            )}

            <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="relative z-50">
              <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
              <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="bg-stone-50 rounded-lg p-6 shadow-xl max-w-md w-full">
                  <h3 className="text-xl font-semibold mb-4">Order Information</h3>
                  {orderInfo && (
                    <div className="space-y-2">
                      <p><span className="font-medium">Order Number:</span> {orderInfo.orderNumber}</p>
                      <p><span className="font-medium">Status:</span> {orderInfo.status}</p>
                      <p><span className="font-medium">Location:</span> {orderInfo.location}</p>
                      <p><span className="font-medium">Last Update:</span> {orderInfo.lastUpdate}</p>
                    </div>
                  )}
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="mt-4 px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600"
                  >
                    Close
                  </button>
                </Dialog.Panel>
              </div>
            </Dialog>

            {orderNumber && !orderInfo && !isSearching && (
              <div className="text-center text-red-500">
                No order found with the specified number.
              </div>
            )}
          </div>
          <div className="text-center mt-3">
            <a href="./contact" className="text-sm text-gray-500 hover:text-teal-600">Need Help?</a>
          </div>
        </div>

        {/* Trust logos */}
        <div className="mb-20">
          <h3 className="text-center text-lg text-gray-500 font-medium mb-6">Trusted by global companies</h3>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
            {trustedLogos.map((logo) => (
              <img
                key={logo.alt}
                src={logo.src}
                alt={logo.alt}
                className="h-8 sm:h-10 opacity-60 grayscale"
              />
            ))}
          </div>
        </div>

        {/* Closing CTA */}
        <div className="text-center bg-teal-600 rounded-2xl px-6 py-14 mb-16">
          <h2 className="text-2xl sm:text-3xl font-light text-white mb-3">Ready to clear customs faster?</h2>
          <p className="text-teal-50 mb-6">Join traders across Africa already moving goods faster with Sentra.</p>
          <button
            type="button"
            onClick={() => navigate('/trader-signup')}
            className="px-10 py-3 bg-white text-teal-700 rounded-xl hover:bg-teal-50 transition-colors font-medium"
          >
            Try for free
          </button>
        </div>
      </div>
    </div>
  )
}