import { Suspense, lazy } from 'react'
import { FiSearch } from 'react-icons/fi'
import './index.css'
import Slider from 'react-slick'
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import TraderSignup from './Components/TraderSignup'
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom'
import ContactPage from './Components/ContactPage'
import Layout from './Components/Layout'
import ErrorBoundary from './Components/ErrorBoundary'
import Dashboard from './Components/Dashboard' 
import { useState } from 'react';
import { motion} from 'framer-motion';
import { FaTruck, FaWarehouse, FaBoxOpen } from 'react-icons/fa';
import CustomsDashboard from './Components/CustomsDashboard';
import { AuthProvider } from './Components/AuthContext';
import Typewriter from 'typewriter-effect';
import { Dialog } from '@headlessui/react'
import { FaClock, FaShieldAlt, FaChartLine } from 'react-icons/fa';import './Components/LandingPage.css';
import Settings from './Components/Settings';
const Footer = lazy(() => import('./Components/Footer'));

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
          <Suspense fallback={<div>Loading...</div>}>
            <Footer />
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
      className={`min-h-screen bg-gray-100 text-gray-800 font-['Montserrat'] flex flex-col relative overflow-hidden landing-page-container`}
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
                {/* <svg width="1.5em" height="1.5em" viewBox="0 0 24 24" strokeWidth="1.5" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.00005 19L19 5.99996M19 5.99996V18.48M19 5.99996H6.52005" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                </svg> */}
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

        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h2 className="text-teal-500 text-xl mb-2">Digital Trade, Simplified</h2>
            <h1 className="text-5xl font-bold mb-4 leading-tight">
              Clear Customs <span className="text-teal-500">40% Faster</span><br />
              with on our platform, grow your business.
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
                alt="Man inspecting customs clearance documents"
                className="w-full h-auto relative z-10 transition-all duration-500 
                           rounded-[30px] transform group-hover:scale-[1.02] main-image"
              />
              
      
            </div>
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
        <div className="mt-16">
          <h3 className="text-center text-xl text-gray-600 mb-6">Trusted by global Companies</h3>
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
      </div>
    </div>
  )
}
