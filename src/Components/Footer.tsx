// import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaLinkedin, FaInstagram, FaGooglePlay, FaApple } from 'react-icons/fa';

const Footer = () => (
  <footer className="bg-gray-900 text-gray-300">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">Afritrade-Xchange</h3>
          <p className="text-sm mb-4">Empowering African trade through innovative solutions.</p>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
              <FaFacebook size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
              <FaLinkedin size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
              <FaInstagram size={20} />
            </a>
          </div>
        </div>
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
          <ul>
            <li className="mb-2">
              <Link to="/" className="text-gray-400 hover:text-white transition-colors duration-300">Home</Link>
            </li>
            <li className="mb-2">
              <Link to="/about" className="text-gray-400 hover:text-white transition-colors duration-300">About Us</Link>
            </li>
            <li className="mb-2">
              <Link to="/services" className="text-gray-400 hover:text-white transition-colors duration-300">Services</Link>
            </li>
            <li className="mb-2">
              <Link to="/contact" className="text-gray-400 hover:text-white transition-colors duration-300">Contact</Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">Resources</h3>
          <ul>
            <li className="mb-2">
              <Link to="/support" className="text-gray-400 hover:text-white transition-colors duration-300">Terms and Conditions</Link>
            </li>
            <li className="mb-2">
              <Link to="/blog" className="text-gray-400 hover:text-white transition-colors duration-300">Privacy Policy</Link>
            </li>
            <li className="mb-2">
              <Link to="/support" className="text-gray-400 hover:text-white transition-colors duration-300">Contact Support</Link>
            </li>
            <li className="mb-2">
              <Link to="/faq" className="text-gray-400 hover:text-white transition-colors duration-300">FAQs</Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">Download Our App</h3>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
              <FaGooglePlay size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
              <FaApple size={20} />
            </a>
          </div>
        </div>
      </div>
    </div>
    <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
      <p>&copy; {new Date().getFullYear()} AfriTrade-Xchange. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;
