import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  MusicalNoteIcon,
  CalendarIcon,
  UserIcon,
  HeartIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import { fetchMySongRequests } from '@/store/slices/songSlice';
import { fetchUpcomingEvents } from '@/store/slices/eventSlice';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import RequestStatus from '@/components/songs/RequestStatus';
import Loader from '@/components/common/Loader';

const DashboardPage = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  
  // Get data from Redux store
  const { myRequests, loading: requestsLoading } = useSelector((state) => state.songs);
  const { upcoming, loading: eventsLoading } = useSelector((state) => state.events);

  console.log('📊 DashboardPage - User:', user?.email);
  console.log('📊 DashboardPage - My Requests:', myRequests?.length);
  console.log('📊 DashboardPage - Upcoming Events:', upcoming?.length);

  useEffect(() => {
    console.log('📊 DashboardPage - Fetching data');
    // Fetch user's song requests (limited to 3 for dashboard)
    dispatch(fetchMySongRequests({ limit: 3 }));
    // Fetch upcoming events (limited to 2 for dashboard)
    dispatch(fetchUpcomingEvents({ limit: 2 }));
  }, [dispatch]);

  // Ensure we have arrays even if the data is not loaded yet
  const requests = myRequests || [];
  const events = upcoming || [];

  // Calculate stats
  const totalRequests = requests.length;
  const totalEvents = events.length;
  
  // Mock stats for now - these would come from API in production
  const profileViews = 128;
  const votesGiven = 47;

  const stats = [
    {
      label: 'My Requests',
      value: totalRequests,
      icon: MusicalNoteIcon,
      color: 'bg-blue-500',
      link: '/my-requests',
    },
    {
      label: 'Upcoming Events',
      value: totalEvents,
      icon: CalendarIcon,
      color: 'bg-green-500',
      link: '/events',
    },
    {
      label: 'Profile Views',
      value: profileViews,
      icon: UserIcon,
      color: 'bg-purple-500',
      link: '/profile',
    },
    {
      label: 'Votes Given',
      value: votesGiven,
      icon: HeartIcon,
      color: 'bg-red-500',
      link: '/my-requests',
    },
  ];

  // Show loading state while fetching initial data
  if (requestsLoading && eventsLoading && requests.length === 0 && events.length === 0) {
    return <Loader fullScreen text="Loading your dashboard..." />;
  }

  return (
    <>
      <Helmet>
        <title>Dashboard - New Band Fellowship</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white mb-2">
              Welcome back, {user?.firstName || 'User'}!
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Here's what's happening with your fellowship journey
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Link key={index} to={stat.link} className="block">
                  <Card className="hover:shadow-soft-lg transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          {stat.label}
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {stat.value}
                        </p>
                      </div>
                      <div className={`${stat.color} p-3 rounded-lg`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Requests */}
            <Card>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Recent Song Requests
                </h2>
                <Link
                  to="/my-requests"
                  className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium flex items-center"
                >
                  View All
                  <ArrowRightIcon className="h-4 w-4 ml-1" />
                </Link>
              </div>

              {requestsLoading ? (
                <div className="animate-pulse space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded" />
                  ))}
                </div>
              ) : requests.length > 0 ? (
                <div className="space-y-4">
                  {requests.slice(0, 3).map((request) => (
                    <Link
                      key={request.id}
                      to="/my-requests"
                      className="block p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {request.songTitle}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {request.createdAt ? new Date(request.createdAt).toLocaleDateString() : 'Recent'}
                          </p>
                        </div>
                        <RequestStatus status={request.status} />
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MusicalNoteIcon className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    You haven't made any song requests yet
                  </p>
                  <Link to="/request-song">
                    <Button variant="primary" size="sm">
                      Request a Song
                    </Button>
                  </Link>
                </div>
              )}
            </Card>

            {/* Upcoming Events */}
            <Card>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Upcoming Events
                </h2>
                <Link
                  to="/events"
                  className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium flex items-center"
                >
                  View All
                  <ArrowRightIcon className="h-4 w-4 ml-1" />
                </Link>
              </div>

              {eventsLoading ? (
                <div className="animate-pulse space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded" />
                  ))}
                </div>
              ) : events.length > 0 ? (
                <div className="space-y-4">
                  {events.slice(0, 2).map((event) => (
                    <Link
                      key={event.id}
                      to={`/events/${event.id}`}
                      className="block p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                        {event.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {event.eventDate ? new Date(event.eventDate).toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: 'numeric',
                        }) : 'Date TBD'}
                      </p>
                      {event.location && (
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          📍 {event.location}
                        </p>
                      )}
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CalendarIcon className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    No upcoming events at this time
                  </p>
                  <Link to="/events">
                    <Button variant="outline" size="sm">
                      Browse Events
                    </Button>
                  </Link>
                </div>
              )}
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <Card>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Link to="/request-song">
                  <Button variant="outline" fullWidth>
                    Request a Song
                  </Button>
                </Link>
                <Link to="/events">
                  <Button variant="outline" fullWidth>
                    Browse Events
                  </Button>
                </Link>
                <Link to="/profile">
                  <Button variant="outline" fullWidth>
                    Edit Profile
                  </Button>
                </Link>
              </div>
            </Card>
          </div>

          {/* Recent Activity - Optional section */}
          {requests.length > 0 && (
            <div className="mt-8">
              <Card>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Recent Activity
                </h2>
                <div className="space-y-3">
                  {requests.slice(0, 2).map((request) => (
                    <div key={request.id} className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                      <div className="h-2 w-2 rounded-full bg-primary-600" />
                      <p>
                        You requested <span className="font-medium text-gray-900 dark:text-white">"{request.songTitle}"</span>
                        {request.status === 'PENDING' && ' - Pending approval'}
                        {request.status === 'SCHEDULED' && ' - Scheduled'}
                        {request.status === 'SUNG' && ' - Has been sung'}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DashboardPage;