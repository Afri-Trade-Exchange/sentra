import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GiAfrica } from 'react-icons/gi';
// import Footer from './Footer';

const NavItem = ({ text, to = '#' }: { text: string; to?: string }) => (
  <Link to={to} className="text-gray-700 hover:text-teal-500">
    {text}
  </Link>
);

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 flex items-center justify-between px-40 py-4 bg-white bg-opacity-80 backdrop-blur-sm z-200">
      {/* <Link to="App" className="flex items-center w-1/4 hover:text-teal-500 transition-colors">
        <GiAfrica className="text-2xl text-teal-500 mr-2" />
        <span className="text-xl font-bold text-gray-700">AfriTrade-Xchange</span>
      </Link> */}
      {/* <button onClick={toggleNavbar} className="md:hidden flex items-center" type="button" aria-label="Toggle navigation">
        <div className="w-hamburger h-hamburger bg-gray-700"></div>
      </button> */}
      {/* <div className={`flex justify-center hover:text-teal-500 items-center space-x-8 w-1/2 ${isOpen ? 'block' : 'hidden'} md:flex `}>
        <NavItem text="I'm a Trader" to="/trader-signup" />
        <NavItem text="I'm a Customs Officer" />
        <NavItem text="Company" to="/contact" />
        <NavItem text="Tracking" />
      </div>
      <div className="flex items-center justify-end space-x-4 w-1/4">
        <button className="px-5 py-2 font-bold text-l text-gray-700 hover:text-teal-500">Register</button>
        <button className="px-4 py-2 font-bold text-l text-gray-700 hover:text-teal-500">Login</button>
        <Link to="/contact" className="px-8 py-3 text-sm text-white bg-teal-500 hover:bg-teal-600 rounded-[15px]">
          Contact Us
        </Link>
      </div> */}
    </nav>
  );
};

export default Navbar;
