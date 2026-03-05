import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import SongRequestForm from '@/components/songs/SongRequestForm';
import Card from '@/components/common/Card';

const RequestSongPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Request a Song - New Band Fellowship</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 mb-6 transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white mb-2">
              Request a Song
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Share which song you'd like to lead during our fellowship
            </p>
          </div>

          {/* Form Card */}
          <Card padding={false}>
            <div className="p-6 md:p-8">
              <SongRequestForm onSuccess={() => navigate('/my-requests')} />
            </div>
          </Card>

          {/* Info Box */}
          <div className="mt-8 bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4">
            <h3 className="text-sm font-medium text-primary-800 dark:text-primary-300 mb-2">
              🎵 About Song Requests
            </h3>
            <p className="text-sm text-primary-700 dark:text-primary-200">
              When you request a song, you're indicating your desire to lead that song 
              during our fellowship. You'll be contacted by our worship team to confirm 
              the details. Feel free to share a testimony about why the song is meaningful 
              to you - this encourages the whole community!
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default RequestSongPage;