import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaTwitter, FaLinkedinIn, FaInstagram, FaFacebookF } from 'react-icons/fa';
import { HiPhone, HiMail } from 'react-icons/hi';
import sentraLogo from '../assets/images/Sentralogo.png';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 500);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [location.pathname]);

  // Only the landing page has a full-bleed hero photo behind the header;
  // everywhere else (and once scrolled past it) the header needs a solid backing to stay legible.
  const overHero = location.pathname === '/' && !scrolled;

  return (
    <div className="flex flex-col min-h-screen">
      <header className="fixed top-4 inset-x-4 sm:inset-x-6 lg:inset-x-10 z-20">
        <nav className={`mx-auto max-w-6xl flex items-center justify-between gap-4 rounded-full px-5 sm:px-6 py-2.5 transition-colors duration-300 ${
          overHero
            ? 'bg-transparent backdrop-blur-[2px]'
            : 'border border-white/40 bg-white/55 backdrop-blur-lg shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.08)]'
        }`}>
          <img
            src={sentraLogo}
            alt="Sentra"
            className={`h-6 sm:h-7 w-auto cursor-pointer transition-all ${overHero ? 'brightness-0 invert' : ''}`}
            onClick={() => navigate('/')}
          />

          {/* Hamburger Menu */}
          <button
            type="button"
            className={`md:hidden p-2 -mr-2 rounded-full transition-colors ${overHero ? 'text-white hover:bg-white/10' : 'text-gray-900 hover:bg-gray-100'}`}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Desktop Navigation */}
          <div className={`hidden md:flex items-center gap-7 text-sm transition-colors duration-300 ${overHero ? 'text-white' : 'text-gray-600'}`}>
            <a href="/trader-signup" className={`font-medium transition-colors ${overHero ? 'hover:text-teal-200' : 'hover:text-teal-600'}`}>I'm a Trader</a>
            <button type="button" onClick={() => navigate('/customs-login')} className={`font-medium transition-colors ${overHero ? 'hover:text-teal-200' : 'hover:text-teal-600'}`}>
              I'm a Customs Officer
            </button>
            <a href="/contact" className={`font-medium transition-colors ${overHero ? 'hover:text-teal-200' : 'hover:text-teal-600'}`}>Company</a>
            <a href="/contact" className={`font-medium transition-colors ${overHero ? 'hover:text-teal-200' : 'hover:text-teal-600'}`}>Tracking</a>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <button type="button" onClick={() => navigate('/login')} className={`px-4 py-2 text-sm font-medium transition-colors ${overHero ? 'text-white hover:text-teal-200' : 'text-gray-600 hover:text-teal-600'}`}>
              Sign in
            </button>
            <button type="button" onClick={() => navigate('/contact')} className="px-5 py-2 text-sm text-white bg-teal-600 hover:bg-teal-700 rounded-full font-medium transition-colors">
              Book a Demo
            </button>
          </div>
        </nav>

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
            <img src={sentraLogo} alt="Sentra" className="h-7 w-auto" />
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
              <a href="/customs-login" className="block py-3 px-4 hover:bg-teal-50 rounded-lg transition-all">
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
                className="w-full py-3 px-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium">
                Register
              </button>
              <button type="button" onClick={() => navigate('/login')}
                className="w-full py-3 px-4 border border-teal-600 text-teal-600 rounded-lg hover:bg-teal-50 transition-colors font-medium">
                Login
              </button>
            </div>

            {/* Social Links */}
            <div className="pt-6 border-t">
              <p className="text-sm text-gray-500 mb-4">Follow us on social media</p>
              <div className="flex space-x-4">
                <a href="#" aria-label="Twitter" className="p-3 text-gray-600 hover:text-teal-600 hover:bg-teal-50 rounded-full transition-colors">
                  <FaTwitter className="w-5 h-5" />
                </a>
                <a href="#" aria-label="LinkedIn" className="p-3 text-gray-600 hover:text-teal-600 hover:bg-teal-50 rounded-full transition-colors">
                  <FaLinkedinIn className="w-5 h-5" />
                </a>
                <a href="#" aria-label="Instagram" className="p-3 text-gray-600 hover:text-teal-600 hover:bg-teal-50 rounded-full transition-colors">
                  <FaInstagram className="w-5 h-5" />
                </a>
                <a href="#" aria-label="Facebook" className="p-3 text-gray-600 hover:text-teal-600 hover:bg-teal-50 rounded-full transition-colors">
                  <FaFacebookF className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Contact Info */}
            <div className="pt-6 border-t space-y-4">
              <p className="text-sm text-gray-500">Need help?</p>
              <a href="tel:+1234567890" className="flex items-center text-teal-600 hover:text-teal-700">
                <HiPhone className="w-5 h-5 mr-2" />
                +123 456 7890
              </a>
              <a href="mailto:support@sentra.com" className="flex items-center text-teal-600 hover:text-teal-700">
                <HiMail className="w-5 h-5 mr-2" />
                support@sentra.com
              </a>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-grow pt-24">
        {children}
      </main>
    </div>
  );
}
