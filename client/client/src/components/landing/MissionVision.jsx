import React from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { SparklesIcon, EyeIcon, HeartIcon, UsersIcon } from '@heroicons/react/24/outline';

const MissionVision = () => {
  const { mission, vision } = useSelector((state) => state.landing);

  const missionContent = {
    title: mission?.title || 'Our Mission',
    content: mission?.content || 'To preserve and promote the rich heritage of Kikuyu gospel music while creating an inclusive community where people can experience God\'s love through worship.',
  };

  const visionContent = {
    title: vision?.title || 'Our Vision',
    content: vision?.content || 'A community where traditional gospel music bridges generations, bringing people together in worship and fellowship.',
  };

  const values = [
    {
      icon: HeartIcon,
      title: 'Faith',
      description: 'Grounded in Christian beliefs and values',
    },
    {
      icon: SparklesIcon,
      title: 'Worship',
      description: 'Celebrating God through traditional music',
    },
    {
      icon: HeartIcon,
      title: 'Love',
      description: 'Showing God\'s love to all people',
    },
    {
      icon: UsersIcon,
      title: 'Community',
      description: 'Building lasting relationships in Christ',
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
    <section className="py-20 bg-church-cream dark:bg-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-serif font-bold text-gray-900 dark:text-white mb-4">
            Our Purpose
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Guiding principles that shape our fellowship and ministry
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Mission Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            whileHover={{ scale: 1.05 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-soft-lg overflow-hidden"
          >
            <div className="h-2 bg-gradient-to-r from-primary-500 to-primary-600" />
            <div className="p-8">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 dark:bg-primary-900 mb-6">
                <SparklesIcon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {missionContent.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                {missionContent.content}
              </p>
              <div className="bg-primary-50 dark:bg-gray-800 rounded-lg p-4">
                <blockquote className="text-sm italic text-primary-700 dark:text-primary-300">
                  "Let the word of Christ dwell in you richly, teaching and admonishing one another in all wisdom, singing psalms and hymns and spiritual songs, with thankfulness in your hearts to God." - Colossians 3:16
                </blockquote>
              </div>
            </div>
          </motion.div>

          {/* Vision Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            whileHover={{ scale: 1.05 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-soft-lg overflow-hidden"
          >
            <div className="h-2 bg-gradient-to-r from-primary-500 to-primary-600" />
            <div className="p-8">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 dark:bg-primary-900 mb-6">
                <EyeIcon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {visionContent.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                {visionContent.content}
              </p>
              <div className="bg-primary-50 dark:bg-gray-800 rounded-lg p-4">
                <blockquote className="text-sm italic text-primary-700 dark:text-primary-300">
                  "Make a joyful noise to the Lord, all the earth; break forth into joyous song and sing praises!" - Psalm 98:4
                </blockquote>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Core Values */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Our Core Values
          </h3>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  transition={{ duration: 0.5 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 dark:bg-primary-900 mb-4">
                    <Icon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {value.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default MissionVision;