import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { CalendarIcon, MapPinIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { fetchUpcomingEvents, fetchPastEvents } from '@/store/slices/eventSlice';
import EventCard from '@/components/events/EventCard';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import Tabs from '@/components/common/Tabs';
import Loader from '@/components/common/Loader';

const EventsPage = () => {
  const dispatch = useDispatch();
  const { upcoming, past, loading } = useSelector((state) => state.events);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    dispatch(fetchUpcomingEvents());
    dispatch(fetchPastEvents());
  }, [dispatch]);

  const filterEvents = (events) => {
    return events.filter(event => {
      const matchesSearch = event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLocation = !location || event.location?.toLowerCase().includes(location.toLowerCase());
      return matchesSearch && matchesLocation;
    });
  };

  const upcomingEvents = filterEvents(upcoming || []);
  const pastEvents = filterEvents(past || []);

  const tabs = [
    { id: 'upcoming', label: 'Upcoming Events' },
    { id: 'past', label: 'Past Events' },
  ];

  return (
    <>
      <Helmet>
        <title>Events - New Band Fellowship</title>
        <meta name="description" content="Join us for upcoming worship events and fellowship sessions in Ruiru Town." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-serif font-bold text-gray-900 dark:text-white mb-4">
              Fellowship Events
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Join us for worship, fellowship, and community gatherings in Ruiru Town
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft p-6 mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Search */}
              <Input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={MagnifyingGlassIcon}
              />

              {/* Location Filter */}
              <Input
                type="text"
                placeholder="Filter by location..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                icon={MapPinIcon}
              />
            </div>
          </motion.div>

          {/* Tabs */}
          <div className="mb-8">
            <Tabs
              tabs={tabs}
              activeTab={activeTab}
              onChange={setActiveTab}
            />
          </div>

          {/* Events Grid */}
          {loading ? (
            <Loader size="lg" text="Loading events..." />
          ) : (
            <>
              {activeTab === 'upcoming' && (
                <>
                  {upcomingEvents.length === 0 ? (
                    <div className="text-center py-12">
                      <CalendarIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        No Upcoming Events
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Check back soon for new events or view our past events.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {upcomingEvents.map((event) => (
                        <EventCard key={event.id} event={event} />
                      ))}
                    </div>
                  )}
                </>
              )}

              {activeTab === 'past' && (
                <>
                  {pastEvents.length === 0 ? (
                    <div className="text-center py-12">
                      <CalendarIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        No Past Events
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Past events will appear here.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {pastEvents.map((event) => (
                        <EventCard key={event.id} event={event} />
                      ))}
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default EventsPage;