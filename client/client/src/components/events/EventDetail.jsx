import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import {
  CalendarIcon,
  MapPinIcon,
  UserGroupIcon,
  ClockIcon,
  ArrowLeftIcon,
  ShareIcon,
} from '@heroicons/react/24/outline';
import { fetchEventById } from '@/store/slices/eventSlice';
import PlaylistView from './PlaylistView';
import RSVPButton from './RSVPButton';
import Loader from '@/components/common/Loader';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();
  const { currentEvent: event, loading } = useSelector((state) => state.events);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    if (id) {
      dispatch(fetchEventById(id));
    }
  }, [dispatch, id]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  if (loading) {
    return <Loader fullScreen text="Loading event details..." />;
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Event not found
          </h2>
          <Link to="/events">
            <Button variant="primary">Back to Events</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isPast = new Date(event.eventDate) < new Date();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 mb-6 transition-colors"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Events
        </button>

        {/* Hero Section */}
        <div className="relative h-96 rounded-2xl overflow-hidden mb-8">
          <img
            src={event.bannerImage || 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              {event.title}
            </h1>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center">
                <CalendarIcon className="h-5 w-5 mr-2" />
                {format(new Date(event.eventDate), 'EEEE, MMMM d, yyyy')}
              </div>
              <div className="flex items-center">
                <ClockIcon className="h-5 w-5 mr-2" />
                {format(new Date(event.eventDate), 'h:mm a')}
              </div>
              {event.location && (
                <div className="flex items-center">
                  <MapPinIcon className="h-5 w-5 mr-2" />
                  {event.location}
                </div>
              )}
            </div>
          </div>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-white p-3 rounded-full hover:bg-white dark:hover:bg-gray-800 transition-colors"
          >
            <ShareIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
          <nav className="flex space-x-8">
            {['details', 'playlist', 'rsvps'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                  activeTab === tab
                    ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {activeTab === 'details' && (
              <Card>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  About This Event
                </h2>
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  {event.description}
                </div>

                {/* Schedule */}
                {event.sessions?.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                      Schedule
                    </h3>
                    <div className="space-y-4">
                      {event.sessions.map((session, index) => (
                        <div
                          key={session.id}
                          className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                        >
                          <div className="flex-shrink-0 w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                            <span className="text-primary-600 dark:text-primary-400 font-bold text-xl">
                              {index + 1}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {session.title}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {format(new Date(session.startTime), 'h:mm a')}
                              {session.endTime && ` - ${format(new Date(session.endTime), 'h:mm a')}`}
                            </p>
                            {session.worshipLeader && (
                              <p className="text-sm text-primary-600 dark:text-primary-400 mt-1">
                                Led by: {session.worshipLeader}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            )}

            {activeTab === 'playlist' && (
              <PlaylistView eventId={event.id} playlist={event.playlist} />
            )}

            {activeTab === 'rsvps' && (
              <Card>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Attendees ({event.rsvps?.length || 0})
                </h2>
                {event.rsvps?.length > 0 ? (
                  <div className="space-y-3">
                    {event.rsvps.map((rsvp) => (
                      <div key={rsvp.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        {rsvp.user?.profileImage ? (
                          <img src={rsvp.user.profileImage} alt={rsvp.user.firstName} className="h-10 w-10 rounded-full" />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                            <span className="text-primary-600 dark:text-primary-400 font-bold">
                              {rsvp.user?.firstName?.[0]}{rsvp.user?.lastName?.[0]}
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {rsvp.user?.firstName} {rsvp.user?.lastName}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {rsvp.numberOfGuests} {rsvp.numberOfGuests === 1 ? 'guest' : 'guests'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                    No attendees yet. Be the first to RSVP!
                  </p>
                )}
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* RSVP Card */}
            <Card>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Attendance
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Confirmed:</span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {event.rsvps?.length || 0}
                  </span>
                </div>
                {event.maxAttendees && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Capacity:</span>
                    <span className="font-bold text-gray-900 dark:text-white">
                      {event.maxAttendees}
                    </span>
                  </div>
                )}
                {!isPast && (
                  <>
                    {isAuthenticated ? (
                      <RSVPButton eventId={event.id} />
                    ) : (
                      <div className="text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          Please login to RSVP for this event
                        </p>
                        <Link to="/login" state={{ from: `/events/${event.id}` }}>
                          <Button variant="primary" fullWidth>
                            Login to RSVP
                          </Button>
                        </Link>
                      </div>
                    )}
                  </>
                )}
              </div>
            </Card>

            {/* Location Card */}
            {event.location && (
              <Card>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Location
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {event.location}
                </p>
                {/* Map could be added here */}
              </Card>
            )}

            {/* Organizer Card */}
            <Card>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Organized by
              </h3>
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                  <UserGroupIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    New Band Fellowship
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Worship Team
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;