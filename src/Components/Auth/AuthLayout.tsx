import React from 'react';
import HeroSection from './HeroSection';

interface AuthLayoutProps {
  children: React.ReactNode;
}

// Shared split-screen shell for the sign-in, sign-up, and forgot-password pages:
// a branded hero panel on the left, the page's own form content on the right.
const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <div className="flex-grow flex bg-stone-100">
      <div className="hidden lg:flex lg:w-2/5">
        <HeroSection />
      </div>
      <div className="w-full lg:w-3/5 flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-md py-10 sm:py-12">
          {children}
        </div>
      </div>
    </div>
  </div>
);

export default AuthLayout;
