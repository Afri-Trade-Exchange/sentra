import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GiAfrica } from 'react-icons/gi';
import { FaTwitter, FaLinkedinIn, FaInstagram, FaFacebookF } from 'react-icons/fa';
import { HiPhone, HiMail } from 'react-icons/hi';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  return (
    <div className="flex flex-col min-h-screen">
      <nav className="fixed top-0 left-0 right-0 flex items-center justify-between px-4 sm:px-8 md:px-12 lg:px-40 py-4 bg-white bg-opacity-80 backdrop-blur-sm z-20">
        <div className="flex items-center w-1/4">
          <div className="logo cursor-pointer" onClick={() => navigate('/')}>
            {/* <GiAfrica className="text-2xl text-teal-500 mr-2" /> */}
          </div>
          <span className="text-xl font-bold text-gray-900 cursor-pointer" onClick={() => navigate('/')}>
            Sentra
          </span>
          <img src="src/assets/images/Sentra_Logo2.png" alt="Logo" className="h-8 w-8 ml-2"/>
        </div>

        {/* Hamburger Menu */}
        <button 
          type="button"
          className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-all" 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex justify-center items-center space-x-8 w-1/2">
          <a href="/trader-signup" className="hover:text-teal-500 font-bold">I'm a Trader</a>
          <button type="button" onClick={() => navigate('/trader-signup')} className="hover:text-teal-500 font-bold">
            I'm a Customs Officer
          </button>
          <a href="/contact" className="hover:text-teal-500 font-bold">Company</a>
          <a href="/contact" className="hover:text-teal-500 font-bold">Tracking</a>
        </div>

        <div className="hidden md:flex items-center justify-end space-x-4 w-1/4">
          <button type="button" onClick={() => navigate('/trader-signup')} className="px-4 py-2 text-l text-gray-700 hover:text-teal-500 font-bold">
            Sign in
          </button>
          <button type="button" onClick={() => navigate('/contact')} className="px-8 py-3 text-l text-white bg-teal-500 hover:bg-teal-600 rounded-[15px] font-bold">
            Book a Demo
          </button>
        </div>

        {/* Mobile Menu Backdrop */}
        {isOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}

        {/* Mobile Navigation */}
        <div className={`
          fixed top-0 right-0 h-screen 
          w-full sm:w-[350px] md:w-[400px] lg:hidden 
          bg-white z-40
          transform transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}>
          {/* Mobile Header */}
          <div className="flex justify-between items-center p-4 border-b">
            <div className="flex items-center">
              <GiAfrica className="text-2xl text-teal-500 mr-2" />
              <span className="text-xl font-bold text-gray-700">AfriTrade</span>
            </div>
            <button 
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close menu"
              className="p-2 hover:bg-gray-100 rounded-full transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Mobile Menu Items */}
          <div className="px-4 py-6 space-y-6 overflow-y-auto h-[calc(100vh-70px)]">
            <div className="space-y-2">
              <a href="/trader-signup" className="block py-3 px-4 hover:bg-teal-50 rounded-lg transition-all">
                <span className="text-gray-700 hover:text-teal-600">I'm a Trader</span>
              </a>
              <a href="/trader-signup" className="block py-3 px-4 hover:bg-teal-50 rounded-lg transition-all">
                <span className="text-gray-700 hover:text-teal-600">I'm a Customs Officer</span>
              </a>
              <a href="/contact" className="block py-3 px-4 hover:bg-teal-50 rounded-lg transition-all">
                <span className="text-gray-700 hover:text-teal-600">Company</span>
              </a>
              <a href="/contact" className="block py-3 px-4 hover:bg-teal-50 rounded-lg transition-all">
                <span className="text-gray-700 hover:text-teal-600">Tracking</span>
              </a>
            </div>

            <div className="space-y-3 pt-6 border-t">
              <button type="button" onClick={() => navigate('/trader-signup')} 
                className="w-full py-3 px-4 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-all">
                Register
              </button>
              <button type="button" onClick={() => navigate('/trader-signup')} 
                className="w-full py-3 px-4 border border-teal-500 text-teal-500 rounded-lg hover:bg-teal-50 transition-all">
                Login
              </button>
            </div>

            {/* Social Links */}
            <div className="pt-6 border-t">
              <p className="text-sm text-gray-500 mb-4">Follow us on social media</p>
              <div className="flex space-x-4">
                <a href="#" aria-label="Twitter" className="p-3 text-gray-600 hover:text-teal-500 hover:bg-teal-50 rounded-full transition-all">
                  <FaTwitter className="w-5 h-5" />
                </a>
                <a href="#" aria-label="LinkedIn" className="p-3 text-gray-600 hover:text-teal-500 hover:bg-teal-50 rounded-full transition-all">
                  <FaLinkedinIn className="w-5 h-5" />
                </a>
                <a href="#" aria-label="Instagram" className="p-3 text-gray-600 hover:text-teal-500 hover:bg-teal-50 rounded-full transition-all">
                  <FaInstagram className="w-5 h-5" />
                </a>
                <a href="#" aria-label="Facebook" className="p-3 text-gray-600 hover:text-teal-500 hover:bg-teal-50 rounded-full transition-all">
                  <FaFacebookF className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Contact Info */}
            <div className="pt-6 border-t space-y-4">
              <p className="text-sm text-gray-500">Need help?</p>
              <a href="tel:+1234567890" className="flex items-center text-teal-500 hover:text-teal-600">
                <HiPhone className="w-5 h-5 mr-2" />
                +123 456 7890
              </a>
              <a href="mailto:support@afritrade.com" className="flex items-center text-teal-500 hover:text-teal-600">
                <HiMail className="w-5 h-5 mr-2" />
                support@afritrade.com
              </a>
            </div>
          </div>
        </div>
      </nav>
      <main className="flex-grow pt-16">
        {children}
      </main>
    </div>
  );
}
