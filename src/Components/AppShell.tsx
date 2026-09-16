import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { IconType } from 'react-icons';
import { FaArrowLeft, FaBars, FaBoxOpen, FaChartPie, FaCog, FaHistory, FaHome, FaSignOutAlt, FaTimes } from 'react-icons/fa';
import sentraLogo from '../assets/images/Sentralogo.png';
import { useAuth } from './AuthContext';

interface NavItem {
  label: string;
  icon: IconType;
  href?: string;
  path?: string;
}

const CUSTOMS_NAV: NavItem[] = [
  { label: 'Overview', icon: FaHome, href: '#overview' },
  { label: 'Consignments', icon: FaBoxOpen, href: '#consignments' },
  { label: 'Analytics', icon: FaChartPie, href: '#analytics' },
  { label: 'Activity', icon: FaHistory, href: '#activity' },
];

const TRADER_NAV: NavItem[] = [
  { label: 'Overview', icon: FaHome, href: '#overview' },
  { label: 'Analytics', icon: FaChartPie, href: '#analytics' },
  { label: 'Activity', icon: FaHistory, href: '#activity' },
];

// Settings has no dashboard of its own to navigate within, so instead of a
// section nav it just needs one way back to whichever dashboard the user
// came from. Remembered across a refresh since Settings can be reached
// directly (bookmark, reload) with no router state to fall back on.
const LAST_DASHBOARD_KEY = 'sentra-last-dashboard';

function getLastDashboardPath(): string {
  try {
    return sessionStorage.getItem(LAST_DASHBOARD_KEY) || '/dashboard';
  } catch {
    return '/dashboard';
  }
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('overview');

  const isCustoms = location.pathname.startsWith('/customs-dashboard');
  const isSettings = location.pathname === '/settings';

  useEffect(() => {
    if (location.pathname === '/dashboard' || location.pathname.startsWith('/customs-dashboard')) {
      try {
        sessionStorage.setItem(LAST_DASHBOARD_KEY, location.pathname);
      } catch {
        // sessionStorage unavailable - the Settings back-link just falls back to /dashboard
      }
    }
  }, [location.pathname]);

  // Settings is a standalone page with no #overview/#activity sections to
  // jump to, so instead of the section nav it gets a single link back to
  // whichever dashboard the user came from, rather than dead links that no-op.
  const primaryNav: NavItem[] = isSettings
    ? [{ label: 'Back to Dashboard', icon: FaArrowLeft, path: getLastDashboardPath() }]
    : isCustoms ? CUSTOMS_NAV : TRADER_NAV;

  useEffect(() => {
    setMobileOpen(false);
    setActiveSection('overview');

    const sectionIds = primaryNav.filter((item) => item.href).map((item) => item.href!.slice(1));
    if (sectionIds.length === 0) return;

    // Highlights the last section whose top has scrolled above a line near
    // the top of the viewport - the standard scroll-spy approach. A pure
    // IntersectionObserver band can never trigger for a short trailing
    // section on a short page (its top can't be scrolled far enough up to
    // reach the band), so the last section is forced active once the page
    // is scrolled to its bottom.
    const THRESHOLD = 120;

    const handleScroll = () => {
      const scrolledToBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;

      if (scrolledToBottom) {
        setActiveSection(sectionIds[sectionIds.length - 1]);
        return;
      }

      let current = sectionIds[0];
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= THRESHOLD) {
          current = id;
        }
      }
      setActiveSection(current);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleNavClick = (item: NavItem) => {
    setMobileOpen(false);
    if (item.path) {
      navigate(item.path);
      return;
    }
    if (item.href) {
      document.querySelector(item.href)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen flex bg-stone-100 dark:bg-gray-900">
      <div className="md:hidden fixed top-0 inset-x-0 h-14 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between px-4 z-40">
        <img src={sentraLogo} alt="Sentra" className="h-6 w-auto cursor-pointer dark:brightness-0 dark:invert" onClick={() => navigate('/')} />
        <button type="button" onClick={() => setMobileOpen(true)} aria-label="Open menu" className="p-2 -mr-2 text-gray-700 dark:text-gray-300">
          <FaBars className="w-5 h-5" />
        </button>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 bg-black/30 z-40 md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 shrink-0 bg-white dark:bg-gray-800 border-r border-gray-100 dark:border-gray-700 flex flex-col z-50 transition-transform duration-200 md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 flex items-center justify-between px-5 border-b border-gray-100 dark:border-gray-700 shrink-0">
          <img src={sentraLogo} alt="Sentra" className="h-6 w-auto cursor-pointer dark:brightness-0 dark:invert" onClick={() => navigate('/')} />
          <button type="button" className="md:hidden text-gray-500 dark:text-gray-400" onClick={() => setMobileOpen(false)} aria-label="Close menu">
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {primaryNav.map((item) => {
            const isActive = item.href ? activeSection === item.href.slice(1) : location.pathname === item.path;
            return (
              <button
                type="button"
                key={item.label}
                onClick={() => handleNavClick(item)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
              >
                <item.icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-teal-600 dark:text-teal-400' : 'text-gray-400 dark:text-gray-500'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="shrink-0 border-t border-gray-100 dark:border-gray-700 p-3 space-y-1">
          <button
            type="button"
            onClick={() => handleNavClick({ label: 'Settings', icon: FaCog, path: '/settings' })}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              location.pathname === '/settings'
                ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            <FaCog className={`w-4 h-4 shrink-0 ${location.pathname === '/settings' ? 'text-teal-600 dark:text-teal-400' : 'text-gray-400 dark:text-gray-500'}`} />
            Settings
          </button>
          <button
            type="button"
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <FaSignOutAlt className="w-4 h-4 shrink-0" />
            Log Out
          </button>
        </div>

        <div className="shrink-0 border-t border-gray-100 dark:border-gray-700 p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center shrink-0">
            <span className="text-sm font-medium text-teal-700 dark:text-teal-400">
              {(user?.displayName || user?.email || 'G').charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
              {user?.displayName || user?.email?.split('@')[0] || 'Guest'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
          </div>
        </div>
      </aside>

      <main className="flex-1 min-w-0 pt-14 md:pt-0">
        {children}
      </main>
    </div>
  );
}
