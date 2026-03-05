import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ChevronRightIcon, PlayCircleIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const Hero = () => {
  const { hero } = useSelector((state) => state.landing) || {};

  // Default content if nothing in Redux
  const heroContent = {
    title: hero?.title || 'Welcome to New Band Fellowship',
    subtitle: hero?.subtitle || 'Experience the beauty of worship through Nyimbo cia Agendi and old Kikuyu gospel songs',
    backgroundImage: hero?.backgroundImage || 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    buttonText: hero?.buttonText || 'Join Us This Sunday',
    buttonLink: hero?.buttonLink || '/events',
  };

  console.log('Hero rendering with:', heroContent); // Debug log

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="relative bg-gray-900 overflow-hidden min-h-[600px] flex items-center">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={heroContent.backgroundImage}
          alt="Worship background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center lg:text-left lg:max-w-3xl"
        >
          <motion.h1 
            variants={fadeInUp}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white"
          >
            <span className="block">{heroContent.title}</span>
            <span className="block text-primary-400 text-3xl sm:text-4xl mt-4">
              {heroContent.subtitle}
            </span>
          </motion.h1>
          
          <motion.p 
            variants={fadeInUp}
            className="mt-6 text-xl text-gray-300 max-w-2xl mx-auto lg:mx-0"
          >
            Join us in Ruiru Town every Sunday for a time of worship, fellowship, 
            and celebration of our rich gospel heritage.
          </motion.p>

          <motion.div 
            variants={fadeInUp}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
          >
            <Link
              to={heroContent.buttonLink}
              className="group inline-flex items-center justify-center px-8 py-4 text-base font-medium rounded-full text-white bg-primary-600 hover:bg-primary-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {heroContent.buttonText}
              <ChevronRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              to="/playlist"
              className="group inline-flex items-center justify-center px-8 py-4 text-base font-medium rounded-full text-primary-600 bg-white hover:bg-gray-50 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <PlayCircleIcon className="mr-2 h-5 w-5" />
              View Playlist
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div 
            variants={fadeInUp}
            className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4"
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-white">100+</div>
              <div className="text-sm text-gray-400">Members</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">50+</div>
              <div className="text-sm text-gray-400">Songs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">5+</div>
              <div className="text-sm text-gray-400">Years</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">200+</div>
              <div className="text-sm text-gray-400">Events</div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Wave Divider */}
      <div className="absolute bottom-0 w-full">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" 
            fill="currentColor" 
            className="text-church-cream dark:text-church-charcoal"
          />
        </svg>
      </div>
    </div>
  );
};

export default Hero;