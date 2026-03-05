import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  MusicalNoteIcon, 
  CalendarIcon, 
} from '@heroicons/react/24/outline';
import { fetchEventById } from '@/store/slices/eventSlice';
import { publicService } from '@/services/publicService';
import PlaylistView from '@/components/events/PlaylistView';
import Loader from '@/components/common/Loader';
import Card from '@/components/common/Card';

const PlaylistPage = () => {
  const { eventId } = useParams();
  const dispatch = useDispatch();
  const { currentEvent, loading } = useSelector((state) => state.events);
  const [upcomingPlaylist, setUpcomingPlaylist] = useState(null);
  const [loadingUpcoming, setLoadingUpcoming] = useState(false);

  useEffect(() => {
    if (eventId) {
      dispatch(fetchEventById(eventId));
    } else {
      fetchUpcomingPlaylist();
    }
  }, [dispatch, eventId]);

  const fetchUpcomingPlaylist = async () => {
    setLoadingUpcoming(true);
    try {
      const data = await publicService.getUpcomingPlaylist();
      setUpcomingPlaylist(data);
    } catch (error) {
      console.error('Error fetching upcoming playlist:', error);
    } finally {
      setLoadingUpcoming(false);
    }
  };

  if (loading || loadingUpcoming) {
    return <Loader fullScreen text="Loading playlist..." />;
  }

  const playlist = eventId ? currentEvent?.playlist : upcomingPlaylist;

  if (!playlist) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <div className="text-center py-12">
              <MusicalNoteIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                No Playlist Available
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {eventId 
                  ? 'This event does not have a playlist yet.' 
                  : 'There is no upcoming event with a playlist.'}
              </p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const eventTitle = eventId 
    ? currentEvent?.title 
    : 'Upcoming Fellowship';

  return (
    <>
      <Helmet>
        <title>Playlist - {eventTitle} - New Band Fellowship</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-serif font-bold text-gray-900 dark:text-white mb-2">
              Worship Playlist
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
              {eventTitle}
            </p>
            {playlist.eventDate && (
              <div className="inline-flex items-center px-4 py-2 bg-primary-100 dark:bg-primary-900 rounded-full">
                <CalendarIcon className="h-4 w-4 text-primary-600 dark:text-primary-400 mr-2" />
                <span className="text-primary-800 dark:text-primary-200">
                  {new Date(playlist.eventDate).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
            )}
          </motion.div>

          {/* Playlist View */}
          <PlaylistView playlist={playlist} />
        </div>
      </div>
    </>
  );
};

export default PlaylistPage;