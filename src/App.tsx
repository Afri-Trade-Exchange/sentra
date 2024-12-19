import { Suspense } from 'react'
import { FiSearch } from 'react-icons/fi'
import './index.css'
import Slider from 'react-slick'
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { FaFacebookF, FaLinkedinIn, FaInstagram, FaApple, FaGooglePlay } from 'react-icons/fa'
import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md'
import TraderSignup from './Components/TraderSignup'
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom'
import ContactPage from './Components/ContactPage'
import Layout from './Components/Layout'
import ErrorBoundary from './Components/ErrorBoundary'
import Dashboard from './Components/Dashboard' 
import { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FaShip, FaTruck, FaWarehouse, FaBoxOpen } from 'react-icons/fa';
import CustomsDashboard from './Components/CustomsDashboard';
import { AuthProvider } from './Components/AuthContext';
import Typewriter from 'typewriter-effect';
import { Dialog } from '@headlessui/react'
import { FaClock, FaShieldAlt, FaChartLine } from 'react-icons/fa';
import { FaBell, FaFileAlt, FaLock, FaCheckCircle } from 'react-icons/fa';
import './Components/LandingPage.css';
import Settings from './Components/Settings';


// // Define an interface for the activity type
// interface Activity {
//   id: number;
//   description: string;
// }

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
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/customs-dashboard" element={<CustomsDashboard />} />
                  <Route path="/settings" element={<Settings />} />
                  {/* Add other routes as needed */}
                </Routes>
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

  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 5000,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 0,
    cssEase: "linear",
    pauseOnHover: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
        }
      }
    ]
  };

  const fetchOrderInfo = async (orderNumber: string) => {
    setIsSearching(true);
    // Simulate API call - replace with actual API call
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

  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);
  // const y = useTransform(scrollYProgress, [0, 0.5], [0, -50]);

  return (
    <div 
      className={`min-h-screen bg-gray-100 text-gray-800 font-['Montserrat'] flex flex-col relative overflow-hidden landing-page-container`}
    >
      {/* Floating Trade Icons */}
      <motion.div 
        style={{ scale }}
        animate={{ 
          y: [0, 20, 0],
          x: [0, 10, -10, 0],
          rotate: [0, 10, -10, 0],
          opacity: [0.2, 0.3, 0.2]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
        className="absolute top-20 left-10 z-0"
      >
        <FaShip className="text-4xl text-teal-500" />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0.2 }}
        animate={{ 
          y: [0, -20, 0],
          scale: [1, 1.1, 1],
          rotate: [0, -10, 10, 0],
          opacity: [0.2, 0.3, 0.2]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatType: "reverse",
          type: "tween"
        }}
        className="absolute top-1/3 right-10 z-0"
      >
        <FaTruck className="text-4xl text-blue-500" />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0.2 }}
        animate={{ 
          rotate: [0, 360],
          scale: [1, 1.2, 1],
          x: [0, 20, -20, 0],
          opacity: [0.2, 0.3, 0.2]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          repeatType: "loop",
          ease: "circInOut"
        }}
        className="absolute bottom-20 left-1/4 z-0"
      >
        <FaWarehouse className="text-4xl text-green-500" />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0.2 }}
        animate={{ 
          y: [0, 15, -15, 0],
          x: [0, 10, -10, 0],
          opacity: [0.2, 0.5, 0.2]
        }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          repeatType: "reverse",
          type: "spring",
          stiffness: 50
        }}
        className="absolute bottom-10 right-1/4 z-0"
      >
        <FaBoxOpen className="text-4xl text-purple-500" />
      </motion.div>

      {/* Subtle trade-inspired background pattern */}
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

      <div className="container mx-auto px-4 py-8 pt-24 relative z-10">
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex flex-col gap-4">
            <div className="flex items-center bg-white rounded-[15px] shadow-md overflow-hidden border border-gray-200">
              <div className="flex-grow flex items-center px-6 relative">
                <FiSearch className="text-gray-400 text-xl mr-3" aria-hidden="true" />
                <input
                  type="text"
                  className="w-full py-4 text-base focus:outline-none"
                  aria-label="Search orders"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                {!orderNumber && (
                  <div className="absolute left-16 top-1/2 -translate-y-1/2 text-gray-400">
                    <Typewriter
                      options={{
                        strings: ['Search Order e.g., ORD-001', 'Track Your Shipment', 'Check Order Status'],
                        autoStart: true,
                        loop: true,
                        delay: 75,
                      }}
                    />
                  </div>
                )}
              </div>
              <button 
                type="button"
                className="bg-teal-500 text-white px-8 py-4 flex items-center gap-2 hover:bg-teal-600 transition-colors rounded-r-[15px]"
                onClick={handleSearch}
              >
                <span>Track Your Shipment</span>
                <svg width="1.5em" height="1.5em" viewBox="0 0 24 24" strokeWidth="1.5" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.00005 19L19 5.99996M19 5.99996V18.48M19 5.99996H6.52005" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
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
                <Dialog.Panel className="bg-white rounded-lg p-6 shadow-xl max-w-md w-full">
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
            <a href="./contact" className="text-sm text-gray-800 hover:text-teal-500">Need Help?</a>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 mb-16">
          <div className="bg-white p-6 rounded-[15px] shadow-md">
            <div className="text-teal-500 text-2xl mb-3">
              <FaClock className="inline-block mr-2" /> Fast Processing
            </div>
            <p className="text-gray-600">Clear customs in half the time with our streamlined digital process</p>
          </div>
          <div className="bg-white p-6 rounded-[15px] shadow-md">
            <div className="text-teal-500 text-2xl mb-3">
              <FaShieldAlt className="inline-block mr-2" /> Secure & Compliant
            </div>
            <p className="text-gray-600">100% compliance with customs regulations and secure document handling</p>
          </div>
          <div className="bg-white p-6 rounded-[15px] shadow-md">
            <div className="text-teal-500 text-2xl mb-3">
              <FaChartLine className="inline-block mr-2" /> Real-time Tracking
            </div>
            <p className="text-gray-600">Monitor your shipments and customs clearance status in real-time</p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h2 className="text-teal-500 text-xl mb-2">Digital Trade, Simplified</h2>
            <h1 className="text-5xl font-bold mb-4 leading-tight">
              Clear Customs <span className="text-teal-500">50% Faster</span><br />
              with Digital Solutions
            </h1>
            <p className="text-gray-600 mb-6">
              One platform for all your cross-border trade needs. Track, manage, and clear shipments seamlessly.
            </p>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate('/trader-signup')} 
                className="px-12 py-3 text-gray-700 bg-white border-2 border-gray-200 rounded-[15px] hover:bg-gray-50 hover:border-gray-300 transition-all"
              >
                How others use it
              </button>
              <button
                type="button"
                onClick={() => navigate('/trader-signup')} 
                className="px-12 py-3 text-white bg-teal-500 rounded-[15px] hover:bg-teal-600 transition-all"
              >
                Try for free
              </button>
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="relative group transform scale-110 mx-auto">
              {/* Glowing background effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-teal-500/20 to-blue-500/20 rounded-[40px] blur-2xl opacity-75 group-hover:opacity-100 transition-all duration-500" />
              
              {/* Semi-transparent overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent rounded-[30px] backdrop-blur-[2px] group-hover:backdrop-blur-[1px] transition-all duration-300" />
              
              {/* Main image */}
              <img
                src="/src/assets/images/clearance.png"
                alt="Illustration of person on bicycle"
                className="w-full h-auto relative z-10 transition-all duration-500 
                           rounded-[30px] transform group-hover:scale-[1.02] main-image"
              />
              
              {/* Decorative elements */}
              <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                              w-[140%] h-[140%] bg-gradient-to-r from-teal-500/10 via-blue-500/10 
                              to-transparent rounded-full blur-3xl opacity-60 group-hover:opacity-75 
                              transition-all duration-500" />
              
              {/* Bottom fade effect */}
              <div className="absolute -z-10 bottom-0 left-0 w-full h-32 
                              bg-gradient-to-t from-gray-100 via-gray-100/50 to-transparent" />
              
              {/* Optional floating elements */}
              <div className="absolute top-5 right-5 bg-white/90 backdrop-blur-sm 
                              p-3 rounded-full shadow-xl transform -rotate-12 
                              group-hover:-rotate-6 transition-all duration-500">
                <svg className="w-6 h-6 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              
              <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-sm 
                              p-3 rounded-full shadow-xl transform rotate-12 
                              group-hover:rotate-6 transition-all duration-500">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* 
        <div className="trade-illustrations relative h-[400px] overflow-hidden my-20">
          {/* Road with Checkpoints *//*}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-20 bg-gray-700 relative">
              {/* Road Markings *//*}
              <div className="absolute inset-0 flex items-center">
                <div className="w-full h-2 flex justify-between">
                  {[...Array(20)].map((_, i) => (
                    <div 
                      key={i} 
                      className="w-16 h-2 bg-yellow-400"
                      style={{ margin: '0 40px' }}
                    />
                  ))}
                </div>
              </div>

              {/* Checkpoint Area *//*}
              <div className="absolute left-1/3 -top-8 bottom-0 w-40 bg-gray-300 rounded-t-lg">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="w-2 h-16 bg-red-500 relative">
                    <motion.div
                      className="w-8 h-2 bg-red-500 absolute top-0 left-1/2 transform -translate-x-1/2"
                      animate={{ rotate: [0, 90, 90, 0] }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        times: [0, 0.3, 0.7, 1]
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Customs Officer *//*}
              <motion.div
                className="absolute left-1/3 top-1/2 transform -translate-y-1/2"
                animate={{
                  y: [-5, 5],
                  rotate: [-5, 5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                <img 
                  src="/src/assets/images/customs-officer.svg" 
                  alt="Customs Officer" 
                  className="w-16 h-16"
                />
              </motion.div>

              {/* Moving Vehicles *//*}
              {[...Array(3)].map((_, index) => (
                <motion.div
                  key={index}
                  className="absolute top-1/2 transform -translate-y-1/2"
                  initial={{ x: window.innerWidth + 100 }}
                  animate={{
                    x: [
                      window.innerWidth + 100, // Start position (right side)
                      window.innerWidth * 0.4, // Position before checkpoint
                      window.innerWidth * 0.4, // Wait at checkpoint
                      -100 // End position (left side)
                    ]
                  }}
                  transition={{
                    duration: 10,
                    times: [0, 0.4, 0.6, 1],
                    delay: index * 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  <motion.div
                    style={{
                      scaleX: -1 // This flips the image horizontally
                    }}
                  >
                    <img 
                      src="/src/assets/images/delivery-truck.svg" 
                      alt={`Delivery Truck ${index + 1}`} 
                      className="w-20 h-20"
                    />
                  </motion.div>
                </motion.div>
              ))}

              {/* Road Signs *//*}
              <div className="absolute right-1/4 -top-12">
                <img 
                  src="/src/assets/images/road-sign.svg" 
                  alt="Road Sign" 
                  className="w-12 h-12"
                />
                <div className="text-xs text-white mt-1">Customs Ahead</div>
              </div>
            </div>
          </div>

          {/* Additional Decorative Elements *//*}
          <motion.div 
            className="absolute top-10 right-1/4"
            animate={{
              y: [-5, 5],
              rotate: [-2, 2]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <img 
              src="/src/assets/images/documents.svg" 
              alt="Documents" 
              className="w-12 h-12"
            />
          </motion.div>

          {/* Add some buildings in the background *//*}
          <div className="absolute left-0 bottom-20 w-full flex justify-around">
            {[...Array(4)].map((_, index) => (
              <div 
                key={index}
                className="w-32 h-48 bg-gray-800 rounded-t-lg"
                style={{
                  transform: `translateY(${index * 10}px)`,
                  opacity: 0.8 - (index * 0.1)
                }}
              />
            ))}
          </div>
        </div>

        {/* CSS Styles
        .trade-illustrations {
          background: linear-gradient(
            180deg,
            #87CEEB 0%,    /* Sky *//*
            #87CEEB 60%,   /* Sky *//*
            #8B4513 60%,   /* Ground *//*
            #8B4513 100%   /* Ground *//*
          );
        }

        .trade-illustrations::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 40px;
          background: rgba(0, 0, 0, 0.2);
          filter: blur(10px);
        }
        *//*}
        */}

        <div className="mt-16">
          <h3 className="text-center text-xl text-gray-600 mb-6">Trusted by Leading Logistics Companies</h3>
          <Slider {...settings}>
            <div className="px-2">
              <img src="/src/assets/images/acceler.png" alt="Acceler" className="h-12 mx-auto" />
            </div>
            <div className="px-2">
              <img src="/src/assets/images/kuehne-nagel.png" alt="kuehne-nagel" className="h-12 mx-auto" />
            </div>
            <div className="px-2">
              <img src="/src/assets/images/ALSL-Logo.png" alt="ALSL" className="h-12 mx-auto" />
            </div>
            <div className="px-2">
              <img src="/src/assets/images/Lori.png" alt="Lori" className="h-12 mx-auto" />
            </div>
            <div className="px-2">
              <img src="/src/assets/images/omlafrica.png" alt="Omla Africa" className="h-12 mx-auto" />
            </div>
            <div className="px-2">
              <img src="/src/assets/images/Siginon-Group.png" alt="Siginon-Group" className="h-12 mx-auto" />
            </div>
          </Slider>
        </div>
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="flex flex-col md:flex-row justify-between items-center">
              {[
                { step: 1, title: "Register", description: "Create your account" },
                { step: 2, title: "Upload", description: "Submit your trade documents" },
                { step: 3, title: "Track", description: "Monitor your clearance progress" },
                { step: 4, title: "Clear", description: "Receive customs clearance" }
              ].map((step, index) => (
                <div key={index} className="flex flex-col items-center mb-8 md:mb-0">
                  <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-center">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-r from-teal-500 to-teal-600 py-20 my-16 rounded-[30px]">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-1/2 mb-10 md:mb-0">
                <h2 className="text-4xl font-bold text-white mb-6">Download Our Mobile App</h2>
                <div className="space-y-4 text-white mb-8">
                  <div className="flex items-start space-x-3">
                    <FaShieldAlt className="text-2xl mt-1" />
                    <div>
                      <h3 className="font-semibold text-xl">Real-Time Tracking</h3>
                      <p className="opacity-90">Track your shipments anytime, anywhere with live updates</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <FaBell className="text-2xl mt-1" />
                    <div>
                      <h3 className="font-semibold text-xl">Instant Notifications</h3>
                      <p className="opacity-90">Get alerts about your shipment status and customs clearance</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <FaFileAlt className="text-2xl mt-1" />
                    <div>
                      <h3 className="font-semibold text-xl">Digital Documentation</h3>
                      <p className="opacity-90">Upload and manage all your trade documents digitally</p>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <a 
                    href="https://play.google.com/store/apps/details?id=com.yourapp" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="bg-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:shadow-lg transition-shadow"
                  >
                    <FaGooglePlay className="text-2xl text-teal-600" />
                    <div>
                      <div className="text-xs text-gray-600">GET IT ON</div>
                      <div className="text-sm font-bold text-gray-800">Google Play</div>
                    </div>
                  </a>
                  <a 
                    href="https://apps.apple.com/app/idyourappid" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="bg-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:shadow-lg transition-shadow"
                  >
                    <FaApple className="text-2xl text-teal-600" />
                    <div>
                      <div className="text-xs text-gray-600">Download on the</div>
                      <div className="text-sm font-bold text-gray-800">App Store</div>
                    </div>
                  </a>
                </div>
              </div>
              <div className="md:w-1/2 relative">
                <img 
                  src="/src/assets/images/app-preview.png" 
                  alt="AfriTrade Mobile App" 
                  className="w-72 mx-auto relative z-10"
                />
                {/* Add floating elements around the app preview */}
                <div className="absolute top-0 right-0 -mr-4 bg-white p-4 rounded-lg shadow-lg">
                  <FaCheckCircle className="text-teal-500 text-xl" />
                  <div className="text-sm mt-1">Instant Updates</div>
                </div>
                <div className="absolute bottom-0 left-0 -ml-4 bg-white p-4 rounded-lg shadow-lg">
                  <FaLock className="text-teal-500 text-xl" />
                  <div className="text-sm mt-1">Secure Access</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Add a download counter section */}
        <div className="container mx-auto px-4 mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-teal-500 mb-2">50K+</div>
              <div className="text-gray-600">App Downloads</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-teal-500 mb-2">4.8/5</div>
              <div className="text-gray-600">User Rating</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-teal-500 mb-2">20+</div>
              <div className="text-gray-600">Countries</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-teal-500 mb-2">24/7</div>
              <div className="text-gray-600">Support</div>
            </div>
          </div>
        </div>
      </div>
      <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white mt-auto relative z-10">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h5 className="text-2xl font-bold mb-4">AfriTrade-Xchange</h5>
              <p className="text-gray-300 mb-4">Streamlining African trade with innovative digital solutions.</p>
              <div className="flex space-x-4">
                <a href="#" aria-label="Facebook" className="text-gray-300 hover:text-teal-500 transition-colors"><FaFacebookF size={20} /></a>
                <a href="#" aria-label="LinkedIn" className="text-gray-300 hover:text-teal-500 transition-colors"><FaLinkedinIn size={20} /></a>
                <a href="#" aria-label="Instagram" className="text-gray-300 hover:text-teal-500 transition-colors"><FaInstagram size={20} /></a>
              </div>
            </div>
            <div>
              <h5 className="text-xl font-bold mb-4">Quick Links</h5>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-teal-500 transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-300 hover:text-teal-500 transition-colors">Our Services</a></li>
                <li><a href="#" className="text-gray-300 hover:text-teal-500 transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-gray-300 hover:text-teal-500 transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-xl font-bold mb-4">Contact Us</h5>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <MdLocationOn className="mr-2 text-teal-500" />
                  <span className="text-gray-300">123 Trade Street, Nairobi, Kenya</span>
                </li>
                <li className="flex items-center">
                  <MdEmail className="mr-2 text-teal-500" />
                  <a href="mailto:info@afritrade.com" className="text-gray-300 hover:text-teal-500 transition-colors">info@afritrade.com</a>
                </li>
                <li className="flex items-center">
                  <MdPhone className="mr-2 text-teal-500" />
                  <a href="tel:+254123456789" className="text-gray-300 hover:text-teal-500 transition-colors">+254 123 456 789</a>
                </li>
              </ul>
            </div>
            <div>
            <h4 className="text-white text-md font-semibold mb-6">Download Our App</h4>
            <div className="flex space-x-4">
              <a 
                href="https://play.google.com/store/apps/details?id=com.yourapp" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-white transition-colors duration-300"
                aria-label="Download on Google Play Store"
              >
                <FaGooglePlay className="h-10" />
              </a>
              <a 
                href="https://apps.apple.com/app/idyourappid" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-white transition-colors duration-300"
                aria-label="Download on Apple App Store"
              >
                <FaApple className="h-10" />
              </a>
            </div>
          </div>
            <div>
              <h5 className="text-xl font-bold mb-4">Newsletter</h5>
              <p className="text-gray-300 mb-4">Stay updated with our latest news and offers.</p>
              <form className="flex">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="bg-gray-700 text-white px-4 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button 
                  type="submit" 
                  className="bg-teal-500 text-white px-4 py-2 rounded-r-md hover:bg-teal-600 transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; {new Date().getFullYear()} AfriTrade-Xchange. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
