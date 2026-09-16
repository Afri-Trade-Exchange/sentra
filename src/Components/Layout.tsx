import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FaTwitter, FaLinkedinIn, FaInstagram, FaFacebookF } from 'react-icons/fa';
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
      <header className="fixed top-4 inset-x-4 sm:inset-x-6 lg:inset-x-10 z-50">
        <nav className={`relative z-50 mx-auto max-w-6xl grid grid-cols-[1fr_auto_1fr] items-center gap-4 rounded-full px-5 sm:px-6 py-2.5 transition-colors duration-300 ${
          overHero
            ? 'bg-transparent backdrop-blur-[2px]'
            : 'border border-white/40 bg-white/55 backdrop-blur-lg shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.08)]'
        }`}>
          <img
            src={sentraLogo}
            alt="Sentra"
            className={`col-start-1 justify-self-start h-6 sm:h-7 w-auto cursor-pointer transition-all ${overHero ? 'brightness-0 invert' : ''}`}
            onClick={() => navigate('/')}
          />

          {/* Desktop Navigation — centered between logo and actions */}
          <div className={`col-start-2 hidden md:flex items-center justify-center gap-5 lg:gap-6 text-sm transition-colors duration-300 ${overHero ? 'text-white' : 'text-gray-600'}`}>
            <a href="/login" className={`font-medium whitespace-nowrap transition-colors ${overHero ? 'hover:text-teal-200' : 'hover:text-teal-600'}`}>Trader</a>
            <button type="button" onClick={() => navigate('/customs-login')} className={`font-medium whitespace-nowrap transition-colors ${overHero ? 'hover:text-teal-200' : 'hover:text-teal-600'}`}>
              Customs
            </button>
            <a href="/pricing" className={`font-medium whitespace-nowrap transition-colors ${overHero ? 'hover:text-teal-200' : 'hover:text-teal-600'}`}>Pricing</a>
            <a href="/blog" className={`font-medium whitespace-nowrap transition-colors ${overHero ? 'hover:text-teal-200' : 'hover:text-teal-600'}`}>Blog</a>
            <a href="/about" className={`font-medium whitespace-nowrap transition-colors ${overHero ? 'hover:text-teal-200' : 'hover:text-teal-600'}`}>Company</a>
            <a href="/contact" className={`font-medium whitespace-nowrap transition-colors ${overHero ? 'hover:text-teal-200' : 'hover:text-teal-600'}`}>Tracking</a>
          </div>

          {/* Right side: hamburger on mobile, sign-in/demo on desktop — same grid cell */}
          <div className="col-start-3 justify-self-end flex items-center">
            <button
              type="button"
              className={`md:hidden relative -mr-1 w-9 h-9 rounded-full flex items-center justify-center transition-colors ${overHero ? 'text-white hover:bg-white/10' : 'text-gray-900 hover:bg-gray-100'}`}
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
              aria-expanded={isOpen}
            >
              <motion.span
                className="absolute w-4 h-0.5 rounded-full bg-current"
                animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 0 : -3 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
              />
              <motion.span
                className="absolute w-4 h-0.5 rounded-full bg-current"
                animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? 0 : 3 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
              />
            </button>

            <div className="hidden md:flex items-center gap-2">
              <button type="button" onClick={() => navigate('/login')} className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${overHero ? 'text-white hover:text-teal-200' : 'text-gray-600 hover:text-teal-600'}`}>
                Sign in
              </button>
              <button type="button" onClick={() => navigate('/contact')} className="px-5 py-2 text-sm text-white bg-teal-600 hover:bg-teal-700 rounded-full font-medium whitespace-nowrap transition-colors">
                Book a Demo
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
                onClick={() => setIsOpen(false)}
              />
              <motion.div
                key="menu"
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="fixed top-[4.5rem] inset-x-4 sm:inset-x-6 sm:left-auto sm:w-96 z-40 md:hidden bg-white/90 backdrop-blur-xl rounded-3xl shadow-[0_1px_2px_rgba(0,0,0,0.04),0_20px_40px_rgba(0,0,0,0.15)] border border-white/60 max-h-[calc(100vh-6.5rem)] overflow-y-auto"
              >
                <div className="px-5 py-5 space-y-5">
                  <div className="space-y-1">
                    <a href="/login" className="block py-2.5 px-3 hover:bg-teal-50 rounded-xl transition-colors" onClick={() => setIsOpen(false)}>
                      <span className="text-gray-700 hover:text-teal-600">I'm a Trader</span>
                    </a>
                    <a href="/customs-login" className="block py-2.5 px-3 hover:bg-teal-50 rounded-xl transition-colors" onClick={() => setIsOpen(false)}>
                      <span className="text-gray-700 hover:text-teal-600">I'm a Customs Officer</span>
                    </a>
                    <a href="/pricing" className="block py-2.5 px-3 hover:bg-teal-50 rounded-xl transition-colors" onClick={() => setIsOpen(false)}>
                      <span className="text-gray-700 hover:text-teal-600">Pricing</span>
                    </a>
                    <a href="/blog" className="block py-2.5 px-3 hover:bg-teal-50 rounded-xl transition-colors" onClick={() => setIsOpen(false)}>
                      <span className="text-gray-700 hover:text-teal-600">Blog</span>
                    </a>
                    <a href="/about" className="block py-2.5 px-3 hover:bg-teal-50 rounded-xl transition-colors" onClick={() => setIsOpen(false)}>
                      <span className="text-gray-700 hover:text-teal-600">Company</span>
                    </a>
                    <a href="/contact" className="block py-2.5 px-3 hover:bg-teal-50 rounded-xl transition-colors" onClick={() => setIsOpen(false)}>
                      <span className="text-gray-700 hover:text-teal-600">Tracking</span>
                    </a>
                  </div>

                  <div className="space-y-2 pt-5 border-t border-gray-100">
                    <button type="button" onClick={() => { navigate('/trader-signup'); setIsOpen(false); }}
                      className="w-full py-2.5 px-4 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors font-medium">
                      Register
                    </button>
                    <button type="button" onClick={() => { navigate('/login'); setIsOpen(false); }}
                      className="w-full py-2.5 px-4 border border-teal-600 text-teal-600 rounded-xl hover:bg-teal-50 transition-colors font-medium">
                      Login
                    </button>
                  </div>

                  {/* Social Links */}
                  <div className="pt-5 border-t border-gray-100">
                    <p className="text-sm text-gray-500 mb-3">Follow us on social media</p>
                    <div className="flex gap-2">
                      <a href="#" aria-label="Twitter" className="p-2.5 text-gray-600 hover:text-teal-600 hover:bg-teal-50 rounded-full transition-colors">
                        <FaTwitter className="w-4 h-4" />
                      </a>
                      <a href="#" aria-label="LinkedIn" className="p-2.5 text-gray-600 hover:text-teal-600 hover:bg-teal-50 rounded-full transition-colors">
                        <FaLinkedinIn className="w-4 h-4" />
                      </a>
                      <a href="#" aria-label="Instagram" className="p-2.5 text-gray-600 hover:text-teal-600 hover:bg-teal-50 rounded-full transition-colors">
                        <FaInstagram className="w-4 h-4" />
                      </a>
                      <a href="#" aria-label="Facebook" className="p-2.5 text-gray-600 hover:text-teal-600 hover:bg-teal-50 rounded-full transition-colors">
                        <FaFacebookF className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>
      <main className="flex-grow pt-24">
        {children}
      </main>
    </div>
  );
}
