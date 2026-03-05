import React from 'react';
import { motion } from 'framer-motion';

const Card = ({
  children,
  className = '',
  padding = true,
  hover = true,
  onClick,
  ...props
}) => {
  const baseClasses = 'bg-white dark:bg-gray-800 rounded-2xl shadow-soft overflow-hidden border border-gray-100 dark:border-gray-700';
  const paddingClass = padding ? 'p-6' : '';
  const hoverClass = hover ? 'hover:shadow-soft-lg transition-all duration-300' : '';
  
  const classes = `${baseClasses} ${paddingClass} ${hoverClass} ${className}`;

  // If onClick is provided, use motion.div with tap animation
  if (onClick) {
    return (
      <motion.div
        className={classes}
        onClick={onClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  // If hover effect is enabled but no click, use whileHover
  if (hover) {
    return (
      <motion.div
        className={classes}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  // Otherwise, use regular div
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

export default Card;