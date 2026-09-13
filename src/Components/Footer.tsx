import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaLinkedin, FaInstagram, FaGooglePlay, FaApple } from 'react-icons/fa';
import sentraLogo from '../assets/images/Sentralogo.png';

// TODO: swap in the real listing URLs once the app is published
const GOOGLE_PLAY_URL = '#';
const APP_STORE_URL = '#';

const socialLinks = [
  { icon: FaFacebook, label: 'Facebook', href: '#' },
  { icon: FaLinkedin, label: 'LinkedIn', href: '#' },
  { icon: FaInstagram, label: 'Instagram', href: '#' },
];

const quickLinks = [
  { label: 'Terms and Conditions', to: '/terms' },
  { label: 'Privacy Policy', to: '/privacy' },
  { label: 'Contact Support', to: '/contact' },
  { label: 'FAQs', to: '/faq' },
];

const Footer: React.FC = () => (
  <footer className="bg-gray-900 text-gray-300 border-t border-white/5">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 text-center md:text-left">
        <div className="md:col-span-4 flex flex-col items-center md:items-start">
          <img src={sentraLogo} alt="Sentra" loading="lazy" decoding="async" className="h-7 w-auto mb-4 brightness-0 invert" />
          <p className="text-sm text-gray-400 mb-6 max-w-xs">
            Smart Solutions, Global Impact. One platform for traders and customs officers across Africa.
          </p>
          <div className="flex justify-center md:justify-start gap-3">
            {socialLinks.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-gray-400 hover:bg-teal-500/10 hover:text-teal-400 transition-colors duration-300"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        <div className="md:col-span-3 flex flex-col items-center md:items-start">
          <h3 className="text-white text-sm font-semibold tracking-wide uppercase mb-4">Quick Links</h3>
          <ul className="space-y-3">
            {quickLinks.map(({ label, to }) => (
              <li key={label}>
                <Link to={to} className="text-sm text-gray-400 hover:text-white transition-colors duration-300">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-5 flex flex-col items-center md:items-start">
          <h3 className="text-white text-sm font-semibold tracking-wide uppercase mb-4">Get the App</h3>
          <p className="text-sm text-gray-400 mb-5 max-w-xs">
            Clear customs on the go — download Sentra for your phone.
          </p>
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-3">
            <a
              href={GOOGLE_PLAY_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Download Sentra on Google Play"
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 transition-colors duration-200"
            >
              <FaGooglePlay className="text-xl text-white shrink-0" />
              <span className="flex flex-col items-start leading-none text-left">
                <span className="text-[10px] text-gray-400">GET IT ON</span>
                <span className="text-sm font-medium text-white">Google Play</span>
              </span>
            </a>
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Download Sentra on the App Store"
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 transition-colors duration-200"
            >
              <FaApple className="text-2xl text-white shrink-0" />
              <span className="flex flex-col items-start leading-none text-left">
                <span className="text-[10px] text-gray-400">Download on the</span>
                <span className="text-sm font-medium text-white">App Store</span>
              </span>
            </a>
          </div>
        </div>
      </div>

      <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-gray-500">© {new Date().getFullYear()} Sentra. All rights reserved.</p>
        <div className="flex gap-6">
          <Link to="/terms" className="text-xs text-gray-500 hover:text-gray-300 transition-colors duration-300">Terms</Link>
          <Link to="/privacy" className="text-xs text-gray-500 hover:text-gray-300 transition-colors duration-300">Privacy</Link>
          <Link to="/contact" className="text-xs text-gray-500 hover:text-gray-300 transition-colors duration-300">Contact</Link>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
