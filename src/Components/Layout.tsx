import React from 'react';
import { GiAfrica } from 'react-icons/gi';
// import NavItem from './NavItem';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <nav className="fixed top-0 left-0 right-0 flex items-center justify-between px-40 py-4 bg-white bg-opacity-80 backdrop-blur-sm z-20">
        <div className="flex items-center w-1/4">
          <GiAfrica className="text-2xl text-orange-500 mr-2" />
          <span className="text-xl font-bold text-gray-700">AfriTrade-Xchange</span>
        </div>
        <div className="flex justify-center items-center space-x-8 w-1/2">
          {/* Temporarily replace NavItem components with simple anchors */}
          <a href="/trader-signup">I'm a Trader</a>
          <a href="#">I'm a Customs Officer</a>
          <a href="#">Company</a>
          <a href="#">Tracking</a>
        </div>
        <div className="flex items-center justify-end space-x-4 w-1/4">
          <button className="px-4 py-2 text-sm  text-gray-700 hover:text-orange-500">Register</button>
          <button className="px-4 py-2 text-sm text-gray-700 hover:text-orange-500">Login</button>
          <button className="px-8 py-3 text-sm text-white bg-orange-500 hover:bg-orange-600 rounded-[15px]">Contact Us</button>
        </div>
      </nav>
      <main className="flex-grow pt-16">
        {children}
      </main>
    </div>
  );
}
