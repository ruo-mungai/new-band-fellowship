import React from 'react';
import { format } from 'date-fns';
import { 
  CalendarIcon, 
  UserIcon, 
  MusicalNoteIcon,
  ChatBubbleLeftIcon,
  HandThumbUpIcon,
} from '@heroicons/react/24/outline'; // Make sure all icons are imported
import { HandThumbUpIcon as HandThumbUpSolidIcon } from '@heroicons/react/24/solid';

const SongRequestCard = ({ request, onVote, onEdit }) => {
  const { user } = useAuth();
  const isOwner = user?.id === request.userId;
  const hasVoted = request.votes?.some(vote => vote.userId === user?.id);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft hover:shadow-soft-lg transition-all duration-300 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {request.songTitle}
            </h3>
            {request.stanzaNumber && (
              <p className="text-sm text-primary-600 dark:text-primary-400 font-medium">
                Stanza: {request.stanzaNumber}
              </p>
            )}
          </div>
          <RequestStatus status={request.status} />
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Requester Info - Only show to admins or owner */}
        {(user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN' || isOwner) && (
          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center">
              <UserIcon className="h-4 w-4 mr-1" />
              {request.user?.firstName} {request.user?.lastName}
            </div>
            <div className="flex items-center">
              <CalendarIcon className="h-4 w-4 mr-1" />
              {format(new Date(request.createdAt), 'MMM d, yyyy')}
            </div>
          </div>
        )}

        {/* Testimony */}
        {request.testimony && (
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <ChatBubbleLeftIcon className="h-5 w-5 text-primary-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Testimony
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                  "{request.testimony}"
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Votes */}
            <div className="flex items-center space-x-1">
              {hasVoted ? (
                <HandThumbUpSolidIcon className="h-5 w-5 text-primary-600" />
              ) : (
                <HandThumbUpIcon className="h-5 w-5 text-gray-400" />
              )}
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {request.voteCount || 0} votes
              </span>
            </div>

            {/* Request Counter */}
            {request.song?.requestCount > 0 && (
              <div className="flex items-center space-x-1">
                <MusicalNoteIcon className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Requested {request.song.requestCount} times
                </span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {request.status === 'PENDING' && isOwner && (
              <button
                onClick={() => onEdit(request)}
                className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
              >
                Edit
              </button>
            )}
            <VoteButton
              requestId={request.id}
              hasVoted={hasVoted}
              onVote={onVote}
            />
          </div>
        </div>
      </div>

      {/* Scheduled Info */}
      {request.scheduledDate && (
        <div className="px-6 py-3 bg-primary-50 dark:bg-primary-900/20 border-t border-primary-100 dark:border-primary-800">
          <p className="text-sm text-primary-700 dark:text-primary-300">
            📅 Scheduled for: {format(new Date(request.scheduledDate), 'EEEE, MMMM d, yyyy')}
          </p>
        </div>
      )}
    </div>
  );
};

export default SongRequestCard;