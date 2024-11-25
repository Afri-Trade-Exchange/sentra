import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaLinkedin, FaInstagram, FaGooglePlay, FaApple } from 'react-icons/fa';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
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
            <h4 className="text-white text-md font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {['Home', 'About', 'Services', 'Contact'].map((item) => (
                <li key={item}>
                  <Link to={`/${item.toLowerCase()}`} className="text-sm hover:text-orange-500 transition-colors duration-300">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white text-md font-semibold mb-4">Our Services</h4>
            <ul className="space-y-2">
              {['Trade Finance', 'Customs Clearance', 'Logistics', 'Market Intelligence'].map((item) => (
                <li key={item}>
                  <Link to={`/services/${item.toLowerCase().replace(' ', '-')}`} className="text-sm hover:text-orange-500 transition-colors duration-300">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white text-md font-semibold mb-4">Download Our App</h4>
            <div className="flex space-x-4">
              <a href="https://play.google.com/store/apps/details?id=com.yourapp" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-300" aria-label="Download on Google Play">
                <span aria-hidden="true">
                  <FaGooglePlay className="h-10" />
                </span>
              </a>
              <a href="https://apps.apple.com/app/idyourappid" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-300" aria-label="Download on the App Store">
                <span aria-hidden="true">
                  <FaApple className="h-10" />
                </span>
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-white text-md font-semibold mb-4">Contact Us</h4>
            <p className="text-sm mb-2">Email: info@afritradexchange.com</p>
            <p className="text-sm mb-2">Phone: +254 123 456 789</p>
            <p className="text-sm">Address: Nairobi, Kenya</p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">&copy; {currentYear} Afritrade. All rights reserved.</p>
          <div className="mt-4 md:mt-0">
            <Link to="/privacy-policy" className="text-sm text-gray-400 hover:text-white mr-4 transition-colors duration-300">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="text-sm text-gray-400 hover:text-white transition-colors duration-300">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
