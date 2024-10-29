import React from 'react'
import { GiAfrica } from 'react-icons/gi'
import { FiSearch } from 'react-icons/fi'
import './index.css'
import Slider from 'react-slick'
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { FaFacebookF, FaLinkedinIn, FaInstagram } from 'react-icons/fa'
import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md'
import TraderSignup from './Components/TraderSignup'
// import { motion } from 'framer-motion' 
// import { FaShip, FaTruck, FaWarehouse, FaBoxOpen } from 'react-icons/fa'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import ContactPage from './Components/ContactPage'
import Layout from './Components/Layout'
import Navbar from './Components/Navbar'
import ErrorBoundary from './Components/ErrorBoundary'
import Dashboard from './Components/Dashboard' 

export default function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="App">
          <Navbar />
          <Layout>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/trader-signup" element={<TraderSignup />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              {/* Add other routes as needed */}
            </Routes>
          </Layout>
        </div>
      </Router>
    </ErrorBoundary>
  )
}

function LandingPage () {
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

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 font-['Comfortaa'] flex flex-col relative overflow-hidden">
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

      <nav className="fixed top-0 left-0 right-0 flex items-center justify-between px-4 py-4 bg-white bg-opacity-80 backdrop-blur-sm z-40 md:px-40">
        <div className="flex items-center w-1/4">
          <GiAfrica className="text-2xl text-orange-500 mr-2" />
          <span className="text-xl font-bold text-gray-700">AfriTrade-Xchange</span>
        </div>
        <div className="hidden md:flex justify-center items-center space-x-8 w-1/2">
          <NavItem text="I'm a Trader" to="/trader-signup" />
          <NavItem text="I'm a Customs Officer" />
          <NavItem text="Company" />
          <NavItem text="Tracking" />
        </div>
        <div className="flex items-center justify-end space-x-4 w-1/4">
          <button className="px-4 py-2 text-l text-gray-700 hover:text-orange-500">Register</button>
          <button className="px-4 py-2 text-l text-gray-700 hover:text-orange-500">Login</button>
          <button className="px-8 py-3 text-l text-white bg-orange-500 hover:bg-orange-600 rounded-[15px]">Contact Us</button>
        </div>
      </nav>
      <div className="container mx-auto px-4 py-8 pt-24 relative z-10">
        <div className="max-w-4xl mx-auto mb-12">                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
          <div className="flex items-center bg-white rounded-full shadow-md overflow-hidden">
            <div className="flex-grow flex items-center px-6">
              <FiSearch className="text-gray-400 text-xl mr-3" />
              <input
                type="text"
                placeholder="Tracking Number or InfoNotice®"
                className="w-full py-4 text-base focus:outline-none"
              />
            </div>
            <button className="bg-orange-500 text-white px-8 py-4 text-base font-semibold hover:bg-orange-600 transition-colors">
              Track
            </button>
          </div>
          <div className="text-center mt-3">
            <a href="./src/assets/components/contact" className="text-sm text-gray-600 hover:text-orange-500">Need Help?</a>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h2 className="text-orange-500 text-xl mb-2">Digital Trade, Simplified</h2>
            <h1 className="text-5xl font-bold mb-4 leading-tight">
              Streamline African trade,<br />
              Eliminate customs delays<br />
              with our <span className="text-orange-500">digital solutions</span><br />
              faster, smoother<br />
              transactions.
            </h1>
            <p className="text-gray-600 mb-6">
              Making customs processes faster and smoother for businesses across Africa.
            </p>
            <button className="px-12 py-3 text-white bg-orange-500 rounded-[15px] hover:bg-orange-600">
              Get Started
            </button>
          </div>
          <div className="md:w-1/2">
            <img
              src="/src/assets/images/Dayflow Riding.png"
              alt="Illustration of person on bicycle"
              className="w-full h-auto"
            />
          </div>
        </div>
        <div className="mt-16">
          <h3 className="text-center text-xl text-gray-600 mb-6">Trusted by Leading Companies</h3>
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
                  <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-center">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white mt-auto relative z-10">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h5 className="text-2xl font-bold mb-4">AfriTrade-Xchange</h5>
              <p className="text-gray-300 mb-4">Streamlining African trade with innovative digital solutions.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-orange-500 transition-colors"><FaFacebookF size={20} /></a>
                <a href="#" className="text-gray-300 hover:text-orange-500 transition-colors"><FaLinkedinIn size={20} /></a>
                <a href="#" className="text-gray-300 hover:text-orange-500 transition-colors"><FaInstagram size={20} /></a>
              </div>
            </div>
            <div>
              <h5 className="text-xl font-bold mb-4">Quick Links</h5>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-orange-500 transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-300 hover:text-orange-500 transition-colors">Our Services</a></li>
                <li><a href="#" className="text-gray-300 hover:text-orange-500 transition-colors">Contact</a></li>
                <li><a href="#" className="text-gray-300 hover:text-orange-500 transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-xl font-bold mb-4">Contact Us</h5>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <MdLocationOn className="mr-2 text-orange-500" />
                  <span className="text-gray-300">123 Trade Street, Nairobi, Kenya</span>
                </li>
                <li className="flex items-center">
                  <MdEmail className="mr-2 text-orange-500" />
                  <a href="mailto:info@afritrade.com" className="text-gray-300 hover:text-orange-500 transition-colors">info@afritrade.com</a>
                </li>
                <li className="flex items-center">
                  <MdPhone className="mr-2 text-orange-500" />
                  <a href="tel:+254123456789" className="text-gray-300 hover:text-orange-500 transition-colors">+254 123 456 789</a>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="text-xl font-bold mb-4">Newsletter</h5>
              <p className="text-gray-300 mb-4">Stay updated with our latest news and offers.</p>
              <form className="flex">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="bg-gray-700 text-white px-4 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <button 
                  type="submit" 
                  className="bg-orange-500 text-white px-4 py-2 rounded-r-md hover:bg-orange-600 transition-colors"
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

function NavItem({ text, to }: { text: string; to?: string }) {
  return (
    <div className="cursor-pointer hover:text-orange-500 transition-colors">
      {to ? (
        <Link to={to}>{text}</Link>
      ) : (
        <span>{text}</span>
      )}
    </div>
  )
}
