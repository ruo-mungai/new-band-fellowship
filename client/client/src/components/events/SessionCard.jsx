import React from 'react';
import { format } from 'date-fns';
import {
  ClockIcon,
  UserIcon,
  MusicalNoteIcon,
  MicrophoneIcon,
  BookOpenIcon,
} from '@heroicons/react/24/outline';
import Card from '@/components/common/Card';

const SessionCard = ({ session, index }) => {
  const getSessionIcon = (type) => {
    switch (type) {
      case 'FIRST_SESSION':
        return <MusicalNoteIcon className="h-6 w-6" />;
      case 'SECOND_SESSION':
        return <MicrophoneIcon className="h-6 w-6" />;
      case 'REQUEST_TIME':
        return <MusicalNoteIcon className="h-6 w-6" />;
      case 'TESTIMONY_TIME':
        return <BookOpenIcon className="h-6 w-6" />;
      default:
        return <ClockIcon className="h-6 w-6" />;
    }
  };

  const getSessionColor = (type) => {
    switch (type) {
      case 'FIRST_SESSION':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'SECOND_SESSION':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'REQUEST_TIME':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'TESTIMONY_TIME':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const formatTime = (time) => {
    return format(new Date(time), 'h:mm a');
  };

  return (
    <Card className="overflow-hidden hover:shadow-soft-lg transition-all duration-300">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-white text-xl font-bold">#{index + 1}</span>
            <h3 className="text-lg font-bold text-white">{session.title}</h3>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSessionColor(session.type)}`}>
            {session.type.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Time */}
        <div className="flex items-center text-gray-600 dark:text-gray-400">
          <ClockIcon className="h-5 w-5 mr-2" />
          <span>
            {formatTime(session.startTime)}
            {session.endTime && ` - ${formatTime(session.endTime)}`}
          </span>
        </div>

        {/* Worship Leader */}
        {session.worshipLeader && (
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <UserIcon className="h-5 w-5 mr-2" />
            <span>Led by: <span className="font-medium text-gray-900 dark:text-white">{session.worshipLeader}</span></span>
          </div>
        )}

        {/* Notes */}
        {session.notes && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 italic">
              "{session.notes}"
            </p>
          </div>
        )}

        {/* Songs in this session (if any) */}
        {session.playlistItems && session.playlistItems.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
              <MusicalNoteIcon className="h-4 w-4 mr-1" />
              Songs in this session ({session.playlistItems.length})
            </h4>
            <div className="space-y-2">
              {session.playlistItems.map((item, idx) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                      {idx + 1}.
                    </span>
                    <span className="text-sm text-gray-900 dark:text-white">
                      {item.song?.title || 'Untitled Song'}
                    </span>
                  </div>
                  {item.song?.artist && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {item.song.artist}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Duration badge */}
      {session.startTime && session.endTime && (
        <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Duration: {Math.round((new Date(session.endTime) - new Date(session.startTime)) / 60000)} minutes
          </p>
        </div>
      )}
    </Card>
  );
};

export default SessionCard;