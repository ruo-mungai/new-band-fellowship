import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRightIcon, HeartIcon } from '@heroicons/react/24/outline';
import Button from '@/components/common/Button';

const CallToAction = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <HeartIcon className="h-16 w-16 mx-auto mb-6 text-white opacity-75" />
          
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
            Join Our Fellowship
          </h2>
          
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Come experience the joy of worship and community with us in Ruiru Town. 
            Everyone is welcome!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/events">
              <Button
                variant="secondary"
                size="lg"
                icon={ArrowRightIcon}
                iconPosition="right"
              >
                View Upcoming Events
              </Button>
            </Link>
            
            <Link to="/contact">
              <Button
                variant="outline"
                size="lg"
                className="bg-transparent text-white border-white hover:bg-white hover:text-primary-600"
              >
                Contact Us
              </Button>
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-12 pt-12 border-t border-primary-400">
            <div>
              <div className="text-3xl font-bold mb-2">5+</div>
              <div className="text-primary-100">Years of Fellowship</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">100+</div>
              <div className="text-primary-100">Active Members</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">50+</div>
              <div className="text-primary-100">Traditional Songs</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction;