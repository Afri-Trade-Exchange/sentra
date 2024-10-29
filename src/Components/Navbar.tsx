import React from 'react';
import { Link } from 'react-router-dom';
import { GiAfrica } from 'react-icons/gi';
// import Footer from './Footer';

const NavItem = ({ text, to = '#' }: { text: string; to?: string }) => (
  <Link to={to} className="text-gray-700 hover:text-orange-500">
    {text}
  </Link>
);

const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 flex items-center justify-between px-40 py-4 bg-white bg-opacity-80 backdrop-blur-sm z-200">
      <Link to="App" className="flex items-center w-1/4 hover:text-orange-500 transition-colors">
        <GiAfrica className="text-2xl text-orange-500 mr-2" />
        <span className="text-xl font-bold text-gray-700">AfriTrade-Xchange</span>
      </Link>
      <div className="flex justify-center items-center space-x-8 w-1/2">
        <NavItem text="I'm a Trader" to="/trader-signup" />
        <NavItem text="I'm a Customs Officer" />
        <NavItem text="Company" />
        <NavItem text="Tracking" />
      </div>
      <div className="flex items-center justify-end space-x-4 w-1/4">
        <button className="px-4 py-2 text-l text-gray-700 hover:text-orange-500">Register</button>
        <button className="px-4 py-2 text-l text-gray-700 hover:text-orange-500">Login</button>
        <Link to="/contact" className="px-8 py-3 text-sm text-white bg-orange-500 hover:bg-orange-600 rounded-[15px]">
          Contact Us
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
