import React from 'react';
import { Link } from 'react-router-dom';
import { 
  HeartIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon,
} from '@heroicons/react/24/outline';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'Events', href: '/events' },
    { name: 'Blog', href: '/blogs' },
    { name: 'Playlist', href: '/playlist' },
    { name: 'About', href: '/about' },
  ];

  // Social links without icons for now (can add FontAwesome later)
  const socialLinks = [
    { name: 'Facebook', href: import.meta.env.VITE_FACEBOOK_URL || '#' },
    { name: 'Twitter', href: import.meta.env.VITE_TWITTER_URL || '#' },
    { name: 'Instagram', href: import.meta.env.VITE_INSTAGRAM_URL || '#' },
    { name: 'YouTube', href: import.meta.env.VITE_YOUTUBE_URL || '#' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold flex items-center">
              <HeartIcon className="h-6 w-6 text-primary-500 mr-2" />
              New Band Fellowship
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Bringing people together through worship, preserving the rich heritage 
              of Kikuyu gospel music in Ruiru Town. Join us in celebrating faith 
              through song.
            </p>
            
            {/* Social Links - simple text links for now */}
            <div className="flex space-x-4 pt-2">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-primary-500 transition-colors text-sm"
                >
                  {social.name}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href} 
                    className="text-gray-400 hover:text-primary-500 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3 text-gray-400">
                <MapPinIcon className="h-5 w-5 text-primary-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm">{import.meta.env.VITE_CONTACT_ADDRESS || 'Ruiru Town, Kenya'}</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <PhoneIcon className="h-5 w-5 text-primary-500 flex-shrink-0" />
                <span className="text-sm">{import.meta.env.VITE_CONTACT_PHONE || '+254 700 000000'}</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <EnvelopeIcon className="h-5 w-5 text-primary-500 flex-shrink-0" />
                <span className="text-sm">{import.meta.env.VITE_CONTACT_EMAIL || 'info@newband.org'}</span>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Fellowship Hours</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li className="flex justify-between">
                <span>Sunday Worship:</span>
                <span className="text-primary-400">9:00 AM - 12:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Wednesday Prayer:</span>
                <span className="text-primary-400">5:00 PM - 7:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Friday Choir:</span>
                <span className="text-primary-400">4:00 PM - 6:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
            <p>&copy; {currentYear} New Band Fellowship. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link to="/privacy" className="hover:text-primary-500 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-primary-500 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;