import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GiAfrica } from 'react-icons/gi';
// import NavItem from './NavItem';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      <nav className="fixed top-0 left-0 right-0 flex items-center justify-between px-40 py-4 bg-white bg-opacity-80 backdrop-blur-sm z-20">
        <div className="flex items-center w-1/4">
          <div 
            className="logo cursor-pointer" 
            onClick={() => navigate('/')}
          >
            <GiAfrica className="text-2xl text-orange-500 mr-2" />
          </div>
          <span 
            className="text-xl font-bold text-gray-700 cursor-pointer"
            onClick={() => navigate('/')}
          >
            AfriTrade-Xchange
          </span>
        </div>
        <div className="flex justify-center items-center space-x-8 w-1/2">
          <a href="/trader-signup">I'm a Trader</a>
          <button 
            onClick={() => navigate('/trader-signup')} 
            className="hover:text-orange-500"
          >
            I'm a Customs Officer
          </button>
          <a href="#">Company</a>
          <a href="#">Tracking</a>
        </div>
        <div className="flex items-center justify-end space-x-4 w-1/4">
          <button 
          onClick={() => navigate('/trader-signup')}
          className="px-4 py-2 text-sm  text-gray-700 hover:text-orange-500"
          >
            Register
            </button>
          <button 
          onClick={() => navigate('/trader-signup')}
          className="px-4 py-2 text-sm text-gray-700 hover:text-orange-500"
          >
            Login
          </button>
          <button 
          onClick={() => navigate('/contact')}
          className="px-8 py-3 text-sm text-white bg-orange-500 hover:bg-orange-600 rounded-[15px]"
          >
            Contact Us
          </button>
        </div>
      </nav>
      <main className="flex-grow pt-16">
        {children}
      </main>
    </div>
  );
}
