import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  MusicalNoteIcon,
  UserIcon,
  ClockIcon,
  ChevronDownIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import Card from '@/components/common/Card';

const PlaylistView = ({ eventId, playlist }) => {
  const [expandedSessions, setExpandedSessions] = useState([]);

  if (!playlist || !playlist.items || playlist.items.length === 0) {
    return (
      <Card>
        <div className="text-center py-12">
          <MusicalNoteIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            No Playlist Available
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            The playlist for this event hasn't been created yet.
          </p>
        </div>
      </Card>
    );
  }

  // Group items by session
  const sessions = playlist.items.reduce((acc, item) => {
    const sessionId = item.session?.id || 'unscheduled';
    if (!acc[sessionId]) {
      acc[sessionId] = {
        id: sessionId,
        title: item.session?.title || 'Unscheduled Songs',
        type: item.session?.type || 'OTHER',
        items: [],
      };
    }
    acc[sessionId].items.push(item);
    return acc;
  }, {});

  const sessionList = Object.values(sessions).sort((a, b) => {
    if (a.id === 'unscheduled') return 1;
    if (b.id === 'unscheduled') return -1;
    return (a.items[0]?.order || 0) - (b.items[0]?.order || 0);
  });

  const toggleSession = (sessionId) => {
    setExpandedSessions(prev =>
      prev.includes(sessionId)
        ? prev.filter(id => id !== sessionId)
        : [...prev, sessionId]
    );
  };

  const getSessionIcon = (type) => {
    switch (type) {
      case 'FIRST_SESSION':
        return '1️⃣';
      case 'SECOND_SESSION':
        return '2️⃣';
      case 'REQUEST_TIME':
        return '🎤';
      case 'TESTIMONY_TIME':
        return '📖';
      default:
        return '🎵';
    }
  };

  return (
    <div className="space-y-6">
      {/* Playlist Header */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Worship Playlist
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {playlist.items.length} songs • {sessionList.length} sessions
            </p>
          </div>
          {playlist.eventDate && (
            <div className="bg-primary-100 dark:bg-primary-900 px-4 py-2 rounded-lg">
              <span className="text-primary-800 dark:text-primary-200 font-medium">
                {new Date(playlist.eventDate).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
          )}
        </div>
      </Card>

      {/* Sessions */}
      {sessionList.map((session) => (
        <Card key={session.id} className="overflow-hidden">
          {/* Session Header */}
          <button
            onClick={() => toggleSession(session.id)}
            className="w-full flex items-center justify-between p-6 bg-gradient-to-r from-primary-50 to-transparent dark:from-gray-800 dark:to-transparent"
          >
            <div className="flex items-center space-x-4">
              <span className="text-3xl">{getSessionIcon(session.type)}</span>
              <div className="text-left">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {session.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {session.items.length} {session.items.length === 1 ? 'song' : 'songs'}
                </p>
              </div>
            </div>
            <ChevronDownIcon
              className={`h-6 w-6 text-gray-500 transition-transform duration-300 ${
                expandedSessions.includes(session.id) ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Session Items */}
          <AnimatePresence>
            {expandedSessions.includes(session.id) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                  {session.items
                    .sort((a, b) => a.order - b.order)
                    .map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        {/* Order */}
                        <div className="flex-shrink-0 w-12 text-center">
                          <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                            {item.order}
                          </span>
                        </div>

                        {/* Thumbnail */}
                        <div className="flex-shrink-0 w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden mr-4">
                          {item.song?.thumbnail ? (
                            <img
                              src={item.song.thumbnail}
                              alt={item.song.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-primary-100 dark:bg-primary-900">
                              <MusicalNoteIcon className="h-8 w-8 text-primary-500" />
                            </div>
                          )}
                        </div>

                        {/* Song Info */}
                        <div className="flex-1">
                          <Link
                            to={`/songs/${item.song?.id}?playlist=${playlist.id}&event=${eventId}`}
                            className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                          >
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {item.song?.title || 'Untitled Song'}
                            </h4>
                          </Link>
                          <div className="flex items-center space-x-4 mt-1">
                            {item.song?.artist && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                                <UserIcon className="h-3 w-3 mr-1" />
                                {item.song.artist}
                              </p>
                            )}
                            {item.song?.duration && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                                <ClockIcon className="h-3 w-3 mr-1" />
                                {item.song.duration}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Worship Leader */}
                        {item.session?.worshipLeader && (
                          <div className="flex-shrink-0 mx-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                              {item.session.worshipLeader}
                            </span>
                          </div>
                        )}

                        {/* Background Color Indicator */}
                        {item.backgroundColor && (
                          <div
                            className="w-4 h-4 rounded-full mr-4"
                            style={{ backgroundColor: item.backgroundColor }}
                            title="Theme Color"
                          />
                        )}

                        {/* Action Buttons */}
                        <div className="flex items-center space-x-2">
                          {/* Lyrics Button */}
                          {item.song?.lyrics && (
                            <Link
                              to={`/songs/${item.song.id}?playlist=${playlist.id}&event=${eventId}`}
                              className="flex-shrink-0 p-2 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                              title="View Lyrics"
                            >
                              <DocumentTextIcon className="h-5 w-5" />
                            </Link>
                          )}

                          {/* YouTube Link */}
                          {item.song?.youtubeUrl && (
                            <a
                              href={item.song.youtubeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-shrink-0 px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                              title="Watch on YouTube"
                            >
                              Watch
                            </a>
                          )}
                        </div>

                        {/* Notes Indicator */}
                        {item.notes && (
                          <div className="ml-2 text-xs text-gray-500 dark:text-gray-400 italic truncate max-w-[150px]">
                            📝 {item.notes.substring(0, 30)}...
                          </div>
                        )}
                      </motion.div>
                    ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      ))}

      {/* Worship Flow Notes */}
      {playlist.flowNotes && (
        <Card>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
            Worship Flow Notes
          </h3>
          <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
            {playlist.flowNotes}
          </p>
        </Card>
      )}
    </div>
  );
};

export default PlaylistView;