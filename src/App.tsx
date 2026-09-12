import { Suspense, lazy, useEffect, useRef } from 'react'
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
import LoginPage from './Components/LoginPage';
import { Dialog } from '@headlessui/react'
import { motion } from 'framer-motion'
import { FaClock, FaShieldAlt, FaChartLine, FaBriefcase, FaUserShield, FaFileUpload, FaQrcode, FaCheckCircle, FaArrowRight, FaPlay } from 'react-icons/fa';
import './Components/LandingPage.css';
import Settings from './Components/Settings';
import heroImg from './assets/images/customs-port-2.jpg';
import sentraMotion from './assets/images/sentra-motion.mp4';
import videoPoster from './assets/images/hero-port-poster.jpg';
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

function DemoVideo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isNearViewport, setIsNearViewport] = useState(false);
  const [canAutoplay, setCanAutoplay] = useState(true);
  const [userStarted, setUserStarted] = useState(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIsNearViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin: '300px' }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const connection = (navigator as unknown as { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    const isSlowOrSaveData = connection?.saveData || connection?.effectiveType === 'slow-2g' || connection?.effectiveType === '2g';
    setCanAutoplay(!prefersReducedMotion && !isSlowOrSaveData);
  }, []);

  const shouldLoadVideo = isNearViewport && (canAutoplay || userStarted);

  return (
    <div ref={containerRef} className="relative w-full aspect-video bg-black">
      {shouldLoadVideo ? (
        <video
          src={sentraMotion}
          poster={videoPoster}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          className="absolute inset-0 w-full h-full object-cover"
        >
          Sorry, your browser doesn't support embedded videos.
        </video>
      ) : (
        <>
          <img
            src={videoPoster}
            alt="Preview of the Sentra platform in action"
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {isNearViewport && (
            <button
              type="button"
              onClick={() => setUserStarted(true)}
              aria-label="Play video: Sentra in action"
              className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors"
            >
              <span className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                <FaPlay className="text-teal-600 text-xl ml-1" />
              </span>
            </button>
          )}
        </>
      )}
    </div>
  );
}

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
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/customs-login" element={<LoginPage />} />
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
      <div className="relative -mt-24 min-h-[600px] sm:min-h-[660px] flex items-center overflow-hidden">
        <img
          src={heroImg}
          alt="Aerial view of stacked shipping containers at a busy port"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 max-w-6xl mx-auto px-4 pt-24 w-full">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-light mb-6 leading-tight text-white">
              Clear Customs <span className="font-semibold text-teal-300">40% Faster</span><br />
              and Keep Your Business Moving.
            </h1>
            <p className="text-base sm:text-lg text-gray-200 mb-8 px-2 sm:px-0">
              One platform for traders and customs officers across Africa — upload your documents, get a QR code, and clear the border without the paperwork chase.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 px-4 sm:px-0">
              <button
                type="button"
                onClick={() => navigate('/trader-signup')}
                className="px-6 sm:px-8 md:px-12 py-3 text-white bg-white/10 border border-white/40 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-colors font-medium"
              >
                How others use it
              </button>
              <button
                type="button"
                onClick={() => navigate('/trader-signup')}
                className="px-6 sm:px-8 md:px-12 py-3 text-white bg-teal-600 rounded-xl hover:bg-teal-700 transition-colors font-medium"
              >
                Try for free
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">

        {/* See it in action */}
        <div className="mb-24">
          <div className="text-center mb-10">
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-50 text-teal-700 text-xs font-semibold tracking-wide uppercase mb-5"
            >
              <FaPlay className="text-[9px]" /> See Sentra in action
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
              className="text-2xl sm:text-3xl font-medium mb-2"
            >
              From upload to cleared, in one flow
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
              className="text-gray-600 text-lg max-w-xl mx-auto"
            >
              Watch how a trader and a customs officer move a consignment through Sentra, start to finish.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 }}
            className="max-w-5xl mx-auto mb-16 rounded-2xl overflow-hidden shadow-lg bg-black"
          >
            <DemoVideo />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="text-center mb-10"
          >
            <h3 className="text-xl sm:text-2xl font-medium mb-2">Wherever you're joining us from, you're in the right place</h3>
            <p className="text-gray-600 text-base sm:text-lg">Pick the side you're on and we'll get you set up.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="bg-stone-50 p-6 sm:p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center"
            >
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
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
              className="bg-stone-50 p-6 sm:p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center"
            >
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
            </motion.div>
          </div>
        </div>

        {/* How it works */}
        <div className="mb-24">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="text-center text-2xl sm:text-3xl font-medium mb-12"
          >
            How it works
          </motion.h2>
          <div className="relative max-w-5xl mx-auto">
            <div
              className="hidden sm:block absolute left-0 right-0 top-8 h-px bg-gradient-to-r from-transparent via-teal-200 to-transparent"
              aria-hidden="true"
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
              {[
                { icon: FaFileUpload, title: 'Upload your documents', body: 'Submit your import or export paperwork once, right from your dashboard.' },
                { icon: FaQrcode, title: 'Get your QR code', body: 'We generate a secure QR code tied to your verified consignment.' },
                { icon: FaCheckCircle, title: 'Cleared at the border', body: 'The officer scans your code and pulls up everything instantly.' },
              ].map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, x: index === 0 ? -24 : index === 2 ? 24 : 0, y: index === 1 ? 24 : 0 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.5, ease: 'easeOut', delay: index * 0.15 }}
                  className="relative text-center"
                >
                  <div className="relative mx-auto mb-5 w-16 h-16 rounded-2xl bg-white ring-1 ring-teal-100 shadow-sm flex items-center justify-center">
                    <step.icon className="text-teal-600 text-2xl" />
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-teal-600 text-white text-xs font-semibold flex items-center justify-center shadow-sm">
                      {index + 1}
                    </span>
                  </div>
                  <h3 className="text-lg font-medium mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.body}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Feature highlights */}
        <div className="mb-24 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="lg:col-span-5 text-center lg:text-left"
            >
              <span className="inline-block text-teal-600 text-xs font-semibold uppercase tracking-wide mb-3">
                Why Sentra
              </span>
              <h2 className="text-2xl sm:text-3xl font-medium mb-4">Why traders choose Sentra</h2>
              <p className="text-gray-600 mb-8">
                Built with traders and customs officers on both sides of the border, so every document, status update, and QR scan stays in sync — no more chasing paperwork by phone or email.
              </p>
              <div className="flex justify-center lg:justify-start gap-10">
                <div>
                  <p className="text-3xl sm:text-4xl font-semibold text-teal-600">40%</p>
                  <p className="text-sm text-gray-500">Faster clearance</p>
                </div>
                <div>
                  <p className="text-3xl sm:text-4xl font-semibold text-teal-600">24/7</p>
                  <p className="text-sm text-gray-500">Document access</p>
                </div>
              </div>
            </motion.div>

            <div className="lg:col-span-7 space-y-3">
              {[
                { icon: FaClock, title: 'Fast Processing', body: 'Clear customs in half the time with our streamlined digital process.' },
                { icon: FaShieldAlt, title: 'Secure & Compliant', body: '100% compliance with customs regulations and secure document handling.' },
                { icon: FaChartLine, title: 'Real-time Tracking', body: 'Monitor your shipments and customs clearance status in real-time.' },
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.5, ease: 'easeOut', delay: index * 0.1 }}
                  className="group flex items-start gap-4 p-5 rounded-2xl border border-transparent hover:border-teal-100 hover:bg-teal-50/40 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-teal-50 group-hover:bg-teal-600 flex items-center justify-center shrink-0 transition-colors">
                    <feature.icon className="text-teal-600 group-hover:text-white text-lg transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">{feature.body}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Track an existing shipment */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="max-w-3xl mx-auto mb-24 bg-stone-50 rounded-2xl shadow-sm p-6 sm:p-10 text-center"
        >
          <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center mx-auto mb-4">
            <FaQrcode className="text-teal-600 text-lg" />
          </div>
          <h2 className="text-xl font-medium mb-1">Already shipping with us?</h2>
          <p className="text-gray-600 mb-6 text-sm">Track your order below.</p>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row items-stretch bg-gray-50 rounded-2xl overflow-hidden border border-gray-200">
              <div className="flex-grow flex items-center px-4 sm:px-6 min-w-0">
                <FiSearch className="text-gray-400 text-xl mr-3 shrink-0" aria-hidden="true" />
                <input
                  type="text"
                  className="w-full min-w-0 py-4 text-base bg-transparent focus:outline-none"
                  aria-label="Search orders"
                  placeholder="Search order, e.g. ORD-001"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <button
                type="button"
                className="bg-teal-600 text-white px-8 py-4 flex items-center justify-center gap-2 hover:bg-teal-700 transition-colors font-medium"
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
        </motion.div>

        {/* Trust logos */}
        <div className="mb-24">
          <motion.h3
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="text-center text-base sm:text-lg text-gray-500 font-medium mb-8"
          >
            Trusted by global companies
          </motion.h3>
          <div className="flex flex-wrap items-center justify-center gap-x-8 sm:gap-x-14 gap-y-6 sm:gap-y-8 px-4">
            {trustedLogos.map((logo, index) => (
              <motion.img
                key={logo.alt}
                src={logo.src}
                alt={logo.alt}
                loading="lazy"
                decoding="async"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 0.6, y: 0 }}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ duration: 0.4, ease: 'easeOut', delay: index * 0.06 }}
                whileHover={{ opacity: 1 }}
                className="h-8 sm:h-11 grayscale hover:grayscale-0 transition-[filter] duration-300"
              />
            ))}
          </div>
        </div>

        {/* Closing CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="relative text-center bg-teal-600 rounded-2xl px-6 py-12 sm:py-16 mb-16 overflow-hidden"
        >
          <div className="pointer-events-none absolute -top-20 -left-16 w-64 h-64 rounded-full bg-teal-400/30 blur-3xl" aria-hidden="true" />
          <div className="pointer-events-none absolute -bottom-24 -right-10 w-72 h-72 rounded-full bg-teal-800/30 blur-3xl" aria-hidden="true" />
          <div className="relative">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-white mb-3">Ready to clear customs faster?</h2>
            <p className="text-teal-50 text-base sm:text-lg mb-8">Join traders across Africa already moving goods faster with Sentra.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button
                type="button"
                onClick={() => navigate('/trader-signup')}
                className="w-full sm:w-auto px-10 py-3 bg-white text-teal-700 rounded-xl hover:bg-teal-50 transition-colors font-medium"
              >
                Try for free
              </button>
              <button
                type="button"
                onClick={() => navigate('/contact')}
                className="w-full sm:w-auto px-10 py-3 text-white border border-white/40 rounded-xl hover:bg-white/10 transition-colors font-medium"
              >
                Talk to us
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}