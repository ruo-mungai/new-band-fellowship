import React, { useState, useEffect, Fragment } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Menu, Transition } from '@headlessui/react';
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  SunIcon,
  MoonIcon,
  HomeIcon,
  CalendarIcon,
  NewspaperIcon,
  MusicalNoteIcon,
  InformationCircleIcon,
  HeartIcon,
} from '@heroicons/react/24/outline';
import { api } from '@/services/api';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [logo, setLogo] = useState(null);
  const [siteTitle, setSiteTitle] = useState('New Band Fellowship');
  const [scrolled, setScrolled] = useState(false);
  const [donationsEnabled, setDonationsEnabled] = useState(false);
  const { user, isAuthenticated, logout, hasRole } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchSiteSettings();
    fetchSystemSettings();
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchSiteSettings = async () => {
    try {
      const response = await api.public.getLanding();
      if (response.data?.logo) {
        setLogo(response.data.logo);
      }
      if (response.data?.siteTitle) {
        setSiteTitle(response.data.siteTitle);
      }
    } catch (error) {
      console.error('Error fetching site settings:', error);
    }
  };

  const fetchSystemSettings = async () => {
    try {
      // Try to get from Redux store first
      // If not available, fetch from API
      const response = await fetch('/api/public/settings');
      const data = await response.json();
      setDonationsEnabled(data?.enableDonations || false);
    } catch (error) {
      console.error('Error fetching system settings:', error);
      // Default to false on error
      setDonationsEnabled(false);
    }
  };

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Base navigation items
  const baseNavigation = [
    { name: 'Home', href: '/', icon: HomeIcon },
    { name: 'Events', href: '/events', icon: CalendarIcon },
    { name: 'Blog', href: '/blogs', icon: NewspaperIcon },
    { name: 'Playlist', href: '/playlist', icon: MusicalNoteIcon },
    { name: 'About', href: '/about', icon: InformationCircleIcon },
  ];

  // Add donations link if enabled
  const navigation = donationsEnabled 
    ? [...baseNavigation, { name: 'Give', href: '/donate', icon: HeartIcon }]
    : baseNavigation;

  // User menu items
  const getUserMenuItems = () => {
    if (!user) return [];
    
    const items = [
      { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
      { name: 'Profile', href: '/profile', icon: UserCircleIcon },
      { name: 'My Requests', href: '/my-requests', icon: MusicalNoteIcon },
    ];

    if (hasRole && hasRole(['ADMIN', 'SUPER_ADMIN'])) {
      items.push({ name: 'Admin Panel', href: '/admin', icon: Cog6ToothIcon });
    }

    return items;
  };

  const userMenuItems = getUserMenuItems();

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg' 
        : 'bg-white dark:bg-gray-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and site title */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              {logo ? (
                <img 
                  src={logo} 
                  alt={siteTitle} 
                  className="h-10 w-auto transition-transform group-hover:scale-110" 
                />
              ) : (
                <div className="h-10 w-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all">
                  <span className="text-white font-bold text-xl">NB</span>
                </div>
              )}
              <span className="font-serif text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {siteTitle}
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-primary-50 dark:bg-gray-800 text-primary-600 dark:text-primary-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </button>

            {/* User Menu */}
            {isAuthenticated && user ? (
              <Menu as="div" className="relative">
                <Menu.Button className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.firstName || 'User'}
                      className="h-8 w-8 rounded-full object-cover ring-2 ring-primary-500"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                      <span className="text-primary-600 dark:text-primary-400 font-medium text-sm">
                        {(user.firstName?.[0] || 'U')}{(user.lastName?.[0] || '')}
                      </span>
                    </div>
                  )}
                  <span className="hidden lg:block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {user.firstName || 'User'}
                  </span>
                </Menu.Button>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-white dark:bg-gray-800 rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-gray-100 dark:divide-gray-700">
                    <div className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {user.firstName || ''} {user.lastName || ''}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {user.email || ''}
                      </p>
                      <p className="text-xs mt-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                          {user.role || 'USER'}
                        </span>
                      </p>
                    </div>
                    
                    <div className="py-1">
                      {userMenuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Menu.Item key={item.name}>
                            {({ active }) => (
                              <Link
                                to={item.href}
                                className={`${
                                  active ? 'bg-gray-100 dark:bg-gray-700' : ''
                                } flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300`}
                              >
                                <Icon className="h-4 w-4 mr-3" />
                                {item.name}
                              </Link>
                            )}
                          </Menu.Item>
                        );
                      })}
                    </div>

                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={handleLogout}
                            className={`${
                              active ? 'bg-gray-100 dark:bg-gray-700' : ''
                            } flex w-full items-center px-4 py-2 text-sm text-red-600 dark:text-red-400`}
                          >
                            <ArrowRightOnRectangleIcon className="h-4 w-4 mr-3" />
                            Logout
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-md hover:shadow-lg"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <Transition
        show={isOpen}
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <div className="md:hidden bg-white dark:bg-gray-900 shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    isActive(item.href)
                      ? 'bg-primary-50 dark:bg-gray-800 text-primary-600 dark:text-primary-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  } flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors`}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      </Transition>
    </nav>
  );
};

export default Navbar;