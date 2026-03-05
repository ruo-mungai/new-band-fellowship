import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { XMarkIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

const EventBanner = ({ banner }) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="relative overflow-hidden"
        style={{ 
          backgroundColor: banner.backgroundColor || '#f97316',
          color: banner.textColor || '#ffffff'
        }}
      >
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between flex-wrap">
            <div className="flex-1 flex items-center">
              <CalendarIcon className="h-6 w-6 mr-3" />
              <p className="font-medium text-lg">
                <span className="md:hidden">{banner.message}</span>
                <span className="hidden md:inline">{banner.message}</span>
              </p>
              {banner.linkUrl && (
                <Link
                  to={banner.linkUrl}
                  className="ml-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all transform hover:scale-105"
                  style={{ color: banner.textColor }}
                >
                  {banner.linkText || 'Learn More'} 
                  <span aria-hidden="true" className="ml-2">&rarr;</span>
                </Link>
              )}
            </div>
            <button
              type="button"
              onClick={() => setIsVisible(false)}
              className="flex p-2 rounded-full hover:bg-black hover:bg-opacity-10 transition-colors"
            >
              <span className="sr-only">Dismiss</span>
              <XMarkIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <motion.div 
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: 10, ease: 'linear' }}
          className="absolute bottom-0 left-0 h-1 bg-white bg-opacity-50"
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default EventBanner;