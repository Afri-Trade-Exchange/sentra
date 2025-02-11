import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaLinkedin, FaInstagram, FaGooglePlay, FaApple } from 'react-icons/fa';

const Footer: React.FC = () => (
  <footer className="bg-gray-900 text-gray-300">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
        <div className="flex flex-col items-center md:items-start">
          <h3 className="text-white text-lg font-semibold mb-4">Afritrade-Xchange</h3>
          <p className="text-lg mb-4">Empowering African trade through innovative solutions.</p>
          <div className="flex justify-center md:justify-start space-x-4">
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
              <FaFacebook size={30} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
              <FaLinkedin size={30} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
              <FaInstagram size={30} />
            </a>
          </div>
        </div>
        
        <div className="flex flex-col items-center md:items-start">
          <h3 className="text-white text-lg font-bold mb-4">Quick Links</h3>
          <ul className="text-center text-lg md:text-left">
            <li className="mb-2">
              <Link to="/terms" className="text-gray-400 hover:text-white transition-colors duration-300">
                Terms and Conditions
              </Link>
            </li>
            <li className="mb-2">
              <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors duration-300">
                Privacy Policy
              </Link>
            </li>
            <li className="mb-2">
              <Link to="/contact" className="text-gray-400 hover:text-white transition-colors duration-300">
                Contact Support
              </Link>
            </li>
            <li className="mb-2">
              <Link to="/faq" className="text-gray-400 hover:text-white transition-colors duration-300">
                FAQs
              </Link>
            </li>
          </ul>
        </div>

        <div className="flex flex-col items-center md:items-start">
          <h3 className="text-white text-lg font-semibold mb-4">Download Our App</h3>
          <div className="flex justify-center md:justify-start space-x-4">
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
              <FaGooglePlay size={30} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
              <FaApple size={30} />
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
