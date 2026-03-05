import React, { useState } from 'react';
import { HandThumbUpIcon } from '@heroicons/react/24/outline';
import { HandThumbUpIcon as HandThumbUpSolidIcon } from '@heroicons/react/24/solid';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const VoteButton = ({ requestId, hasVoted, onVote }) => {
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleVote = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to vote');
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      await onVote(requestId);
    } catch (error) {
      toast.error(error.message || 'Failed to vote');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleVote}
      disabled={loading}
      className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
        hasVoted
          ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
          : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
      } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {loading ? (
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-500 border-t-transparent" />
      ) : hasVoted ? (
        <HandThumbUpSolidIcon className="h-4 w-4" />
      ) : (
        <HandThumbUpIcon className="h-4 w-4" />
      )}
      <span>{hasVoted ? 'Voted' : 'Vote'}</span>
    </button>
  );
};

export default VoteButton;