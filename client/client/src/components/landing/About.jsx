import React from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { HeartIcon, UserGroupIcon, MusicalNoteIcon, CalendarIcon } from '@heroicons/react/24/outline';

const About = () => {
  const { about } = useSelector((state) => state.landing);

  const aboutContent = {
    title: about?.title || 'About New Band Fellowship',
    content: about?.content || 'We are a community of believers dedicated to preserving and celebrating the rich heritage of Kikuyu gospel music while creating a welcoming space for worship and fellowship in Ruiru Town.',
    imageUrl: about?.imageUrl || 'https://images.unsplash.com/photo-1524863479829-916d8e77f114?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80',
  };

  const features = [
    {
      icon: HeartIcon,
      title: 'Worship',
      description: 'Authentic worship experiences blending traditional and contemporary styles',
    },
    {
      icon: UserGroupIcon,
      title: 'Fellowship',
      description: 'Building lasting relationships through community gatherings',
    },
    {
      icon: MusicalNoteIcon,
      title: 'Music',
      description: 'Preserving Nyimbo cia Agendi and old Kikuyu gospel songs',
    },
    {
      icon: CalendarIcon,
      title: 'Events',
      description: 'Regular fellowship sessions and special worship events',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
          {/* Image Column */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative mb-12 lg:mb-0"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={aboutContent.imageUrl}
                alt="Fellowship gathering"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-600/20 to-transparent" />
            </div>
            
            {/* Stats Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="absolute -bottom-6 -right-6 bg-white dark:bg-gray-800 rounded-2xl shadow-soft-lg p-6 hidden lg:block"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-primary-100 dark:bg-primary-900 rounded-full p-4">
                  <HeartIcon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">5+ Years</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">of Faithful Service</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Content Column */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:pl-8"
          >
            <h2 className="text-4xl font-serif font-bold text-gray-900 dark:text-white mb-6">
              {aboutContent.title}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
              {aboutContent.content}
            </p>

            {/* Features Grid */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            >
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    transition={{ duration: 0.5 }}
                    className="flex items-start space-x-3"
                  >
                    <div className="flex-shrink-0">
                      <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-lg">
                        <Icon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8"
            >
              <a
                href="#learn-more"
                className="inline-flex items-center text-primary-600 dark:text-primary-400 font-medium hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
              >
                Learn more about our ministry
                <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;