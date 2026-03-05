import React from 'react';
import { Link } from 'react-router-dom';
import { MusicalNoteIcon } from '@heroicons/react/24/outline'; // Make sure this is imported
import SongRequestCard from './SongRequestCard';
import Loader from '@/components/common/Loader';
import Button from '@/components/common/Button';

const SongRequestList = ({ 
  requests, 
  loading, 
  error, 
  onVote, 
  onEdit,
  showLoadMore,
  onLoadMore,
  hasMore 
}) => {
  if (loading && requests.length === 0) {
    return (
      <div className="flex justify-center py-12">
        <Loader size="lg" text="Loading requests..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400 mb-4">Error: {error}</p>
        <Button variant="primary" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl">
        <MusicalNoteIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          No Song Requests Yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Be the first to request a song for our next fellowship!
        </p>
        <Link to="/request-song">
          <Button variant="primary">Request a Song</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {requests.map((request) => (
          <SongRequestCard
            key={request.id}
            request={request}
            onVote={onVote}
            onEdit={onEdit}
          />
        ))}
      </div>

      {showLoadMore && hasMore && (
        <div className="text-center mt-8">
          <Button
            variant="outline"
            onClick={onLoadMore}
            loading={loading}
          >
            Load More Requests
          </Button>
        </div>
      )}
    </div>
  );
};

export default SongRequestList;