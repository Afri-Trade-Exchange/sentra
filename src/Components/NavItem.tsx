import React from 'react';
import { Link } from 'react-router-dom';

interface NavItemProps {
  text: string;
  to?: string;
}

const NavItem: React.FC<NavItemProps> = ({ text, to }) => {
  if (to) {
    return <Link to={to} className="text-gray-700 hover:text-orange-500">{text}</Link>;
  }
  return <span className="text-gray-700">{text}</span>;
};

export default NavItem;
