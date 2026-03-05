import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  ArrowLeftIcon,
  MusicalNoteIcon,
  UserIcon,
  CalendarIcon,
  PlayIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Loader from '@/components/common/Loader';
import { songService } from '@/services/songService';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';

const SongLyricsPage = () => {
  const { songId, playlistId, eventId } = useParams();
  const navigate = useNavigate();
  const [song, setSong] = useState(null);
  const [playlistItem, setPlaylistItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSongDetails();
  }, [songId, playlistId]);

  const fetchSongDetails = async () => {
    setLoading(true);
    try {
      // Fetch song details
      const songData = await songService.getSongById(songId);
      setSong(songData);

      // If we have playlistId, fetch playlist item details
      if (playlistId) {
        const playlistData = await songService.getPlaylistItem(playlistId, songId);
        setPlaylistItem(playlistData);
      }
    } catch (error) {
      console.error('Error fetching song details:', error);
      setError('Failed to load song details');
      toast.error('Failed to load song details');
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    if (eventId) {
      navigate(`/events/${eventId}`);
    } else if (playlistId) {
      navigate(`/playlist/${playlistId}`);
    } else {
      navigate(-1);
    }
  };

  if (loading) {
    return <Loader fullScreen text="Loading song lyrics..." />;
  }

  if (error || !song) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12">
        <div className="text-center max-w-md mx-auto px-4">
          <MusicalNoteIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-white mb-4">
            Song Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            The song you're looking for doesn't exist or may have been removed.
          </p>
          <Button
            variant="primary"
            onClick={handleGoBack}
            icon={ArrowLeftIcon}
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{song.title} - New Band Fellowship</title>
        <meta name="description" content={`Lyrics for ${song.title}${song.artist ? ` by ${song.artist}` : ''}`} />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <button
            onClick={handleGoBack}
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 mb-6 transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back
          </button>

          {/* Song Header */}
          <Card className="mb-8">
            <div className="p-8">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 dark:text-white mb-2">
                    {song.title}
                  </h1>
                  {song.artist && (
                    <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
                      by {song.artist}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    {song.isOriginal && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                        Original Composition
                      </span>
                    )}
                    {song.requestCount > 0 && (
                      <span className="flex items-center">
                        <MusicalNoteIcon className="h-4 w-4 mr-1" />
                        Requested {song.requestCount} times
                      </span>
                    )}
                    {song.createdAt && (
                      <span className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        Added {format(new Date(song.createdAt), 'MMMM d, yyyy')}
                      </span>
                    )}
                  </div>
                </div>

                {song.youtubeUrl && (
                  <a
                    href={song.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <PlayIcon className="h-5 w-5" />
                    <span>Watch on YouTube</span>
                  </a>
                )}
              </div>
            </div>
          </Card>

          {/* Playlist-specific Notes */}
          {playlistItem && playlistItem.notes && (
            <Card className="mb-8 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800">
              <div className="p-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center">
                  <DocumentTextIcon className="h-5 w-5 mr-2 text-primary-600" />
                  Notes for this Performance
                </h2>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {playlistItem.notes}
                </p>
                {playlistItem.session && (
                  <p className="mt-3 text-sm text-primary-600 dark:text-primary-400">
                    Session: {playlistItem.session.title}
                  </p>
                )}
              </div>
            </Card>
          )}

          {/* Lyrics Section */}
          <Card>
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <DocumentTextIcon className="h-6 w-6 mr-2 text-primary-600" />
                Lyrics
              </h2>
              
              {song.lyrics ? (
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  {song.lyrics.split('\n').map((line, index) => (
                    <p key={index} className="mb-2">
                      {line}
                    </p>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <DocumentTextIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    No lyrics available for this song.
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Request Info */}
          {song.requestCount > 0 && (
            <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
              <p>
                This song has been requested {song.requestCount} times by the fellowship.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SongLyricsPage;