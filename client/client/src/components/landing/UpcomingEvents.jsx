import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarIcon, MapPinIcon, UserGroupIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { fetchUpcomingEvents } from '@/store/slices/eventSlice';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { format } from 'date-fns';

const UpcomingEvents = () => {
  const dispatch = useDispatch();
  const fetchedRef = useRef(false);
  const { upcoming, loading, error } = useSelector((state) => state.events);

  useEffect(() => {
    if (!fetchedRef.current) {
      fetchedRef.current = true;
      dispatch(fetchUpcomingEvents());
    }
  }, [dispatch]);

  // Show loading state
  if (loading) {
    return (
      <section className="py-20 bg-church-cream dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="h-10 w-64 bg-gray-300 dark:bg-gray-700 rounded mx-auto mb-4 animate-pulse" />
            <div className="h-6 w-96 bg-gray-300 dark:bg-gray-700 rounded mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft">
                <div className="h-48 bg-gray-300 dark:bg-gray-700 rounded-lg mb-4 animate-pulse" />
                <div className="h-6 w-3/4 bg-gray-300 dark:bg-gray-700 rounded mb-2 animate-pulse" />
                <div className="h-4 w-full bg-gray-300 dark:bg-gray-700 rounded mb-2 animate-pulse" />
                <div className="h-4 w-2/3 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Show error state
  if (error) {
    return (
      <section className="py-20 bg-church-cream dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-red-100 dark:bg-red-900/20 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-red-800 dark:text-red-200 mb-2">
              Unable to Load Events
            </h3>
            <p className="text-red-600 dark:text-red-400 mb-6">{error}</p>
            <Button 
              onClick={() => {
                fetchedRef.current = false;
                dispatch(fetchUpcomingEvents());
              }}
              variant="primary"
            >
              Try Again
            </Button>
          </div>
        </div>
      </section>
    );
  }

  // Show empty state
  if (!upcoming || upcoming.length === 0) {
    return (
      <section className="py-20 bg-church-cream dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <CalendarIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            No Upcoming Events
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Check back soon for new fellowship events!
          </p>
          <Link to="/contact">
            <Button variant="primary">Contact Us</Button>
          </Link>
        </div>
      </section>
    );
  }

  // Show events
  return (
    <section className="py-20 bg-church-cream dark:bg-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-serif font-bold text-gray-900 dark:text-white mb-4">
            Upcoming Events
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Join us for these upcoming fellowship sessions and worship experiences
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {upcoming.map((event) => (
            <Card key={event.id} className="h-full flex flex-col">
              {/* Date Badge */}
              <div className="absolute top-4 right-4 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                {format(new Date(event.eventDate), 'MMM d')}
              </div>

              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {event.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {event.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    {format(new Date(event.eventDate), 'EEEE, MMMM d, yyyy')}
                  </div>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <MapPinIcon className="h-4 w-4 mr-2" />
                    {event.location || 'Ruiru Town'}
                  </div>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <UserGroupIcon className="h-4 w-4 mr-2" />
                    {event.attendees || 0} attending
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <Link to={`/events/${event.id}`}>
                  <Button variant="outline" size="sm" fullWidth>
                    View Details
                    <ArrowRightIcon className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/events">
            <Button variant="primary" size="lg">
              View All Events
              <ArrowRightIcon className="h-5 w-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default UpcomingEvents;