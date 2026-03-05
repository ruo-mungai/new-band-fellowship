import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MusicalNoteIcon,
  UserIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { api } from '@/services/api';
import Loader from '@/components/common/Loader';

const SongDetailPage = () => {
  const { eventId, songId } = useParams();
  const navigate = useNavigate();
  const [song, setSong] = useState(null);
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(-1);

  useEffect(() => {
    fetchSongDetails();
  }, [eventId, songId]);

  const fetchSongDetails = async () => {
    setLoading(true);
    try {
      // Fetch playlist to get all songs
      const playlistResponse = await api.public.getPlaylist(eventId);
      setPlaylist(playlistResponse.data);
      
      // Find current song and index
      const items = playlistResponse.data.items || [];
      const index = items.findIndex(item => item.id === songId);
      setCurrentIndex(index);
      
      if (index !== -1) {
        setSong(items[index]);
      } else {
        // Fetch individual song if not in playlist
        const songResponse = await api.songs.getOne(songId);
        setSong(songResponse.data);
      }
    } catch (error) {
      console.error('Error fetching song:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigateToSong = (direction) => {
    if (!playlist || !playlist.items) return;
    
    const newIndex = currentIndex + direction;
    if (newIndex >= 0 && newIndex < playlist.items.length) {
      const nextSong = playlist.items[newIndex];
      navigate(`/events/${eventId}/songs/${nextSong.id}`);
    }
  };

  if (loading) {
    return <Loader fullScreen text="Loading song..." />;
  }

  if (!song) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Song not found
          </h2>
          <Link to={`/events/${eventId}`}>
            <Button variant="primary">Back to Event</Button>
          </Link>
        </div>
      </div>
    );
  }

  const backgroundColor = song.backgroundColor || '#f97316';
  const backgroundImage = song.backgroundImage;

  return (
    <>
      <Helmet>
        <title>{song.song?.title} - New Band Fellowship</title>
      </Helmet>

      <div 
        className="min-h-screen py-12 transition-colors duration-300"
        style={{
          backgroundColor: !backgroundImage ? backgroundColor : undefined,
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay for better text readability when using background image */}
        {backgroundImage && (
          <div className="absolute inset-0 bg-black/50" />
        )}

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Navigation */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => navigate(`/events/${eventId}`)}
              className="flex items-center text-white bg-black/20 hover:bg-black/30 px-4 py-2 rounded-lg transition-colors"
            >
              <ChevronLeftIcon className="h-5 w-5 mr-2" />
              Back to Playlist
            </button>

            {playlist && playlist.items && playlist.items.length > 1 && (
              <div className="flex space-x-2">
                <button
                  onClick={() => navigateToSong(-1)}
                  disabled={currentIndex <= 0}
                  className="p-2 bg-black/20 hover:bg-black/30 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>
                <span className="text-white bg-black/20 px-4 py-2 rounded-lg">
                  {currentIndex + 1} / {playlist.items.length}
                </span>
                <button
                  onClick={() => navigateToSong(1)}
                  disabled={currentIndex >= playlist.items.length - 1}
                  className="p-2 bg-black/20 hover:bg-black/30 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRightIcon className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>

          {/* Song Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-2xl shadow-soft-lg p-8"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-serif font-bold text-gray-900 dark:text-white mb-2">
                {song.song?.title}
              </h1>
              {song.song?.artist && (
                <p className="text-xl text-gray-600 dark:text-gray-400">
                  by {song.song.artist}
                </p>
              )}
              {song.session && (
                <p className="text-primary-600 dark:text-primary-400 mt-2">
                  {song.session.title}
                </p>
              )}
            </div>

            {/* Stanzas/Lyrics */}
            {song.notes && (
              <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  How to Sing
                </h2>
                <div dangerouslySetInnerHTML={{ __html: song.notes }} />
              </div>
            )}

            {song.song?.lyrics && (
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Lyrics
                </h2>
                <pre className="whitespace-pre-wrap font-sans text-gray-700 dark:text-gray-300">
                  {song.song.lyrics}
                </pre>
              </div>
            )}

            {/* Worship Leader Info */}
            {song.session?.worshipLeader && (
              <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-center space-x-2">
                  <UserIcon className="h-5 w-5 text-primary-600" />
                  <span className="text-gray-700 dark:text-gray-300">
                    Worship Leader: {song.session.worshipLeader}
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default SongDetailPage;