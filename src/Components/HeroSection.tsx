import React from 'react';
import { FaFileAlt, FaBolt, FaShieldAlt } from 'react-icons/fa';
import sentraLogo from '../assets/images/Sentralogo.png';

const features = [
  { icon: FaFileAlt, label: 'Seamless documentation' },
  { icon: FaBolt, label: 'Fast transactions' },
  { icon: FaShieldAlt, label: 'Secure platform' },
];

const HeroSection: React.FC = () => (
  <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-teal-600 to-teal-800 p-8 lg:p-10">
    <div className="pointer-events-none absolute -top-16 -left-12 w-56 h-56 rounded-full bg-teal-400/30 blur-3xl" aria-hidden="true" />
    <div className="pointer-events-none absolute -bottom-20 -right-8 w-64 h-64 rounded-full bg-teal-900/40 blur-3xl" aria-hidden="true" />

    <div className="relative max-w-sm text-white">
      <img src={sentraLogo} alt="Sentra" className="h-6 w-auto mb-6 brightness-0 invert" />
      <h1 className="text-xl lg:text-2xl font-semibold mb-3 leading-snug">
        Clear customs without the paperwork chase
      </h1>
      <p className="text-teal-50/90 text-sm mb-6">
        One platform for traders and customs officers across Africa.
      </p>
      <div className="space-y-3">
        {features.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              <Icon className="text-white text-sm" />
            </div>
            <span className="text-teal-50 text-sm">{label}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default HeroSection;
