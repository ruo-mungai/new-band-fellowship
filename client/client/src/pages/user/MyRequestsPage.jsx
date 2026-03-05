import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { 
  PlusIcon, 
  FunnelIcon,
  ArrowPathIcon,
  MusicalNoteIcon,
} from '@heroicons/react/24/outline';
import { fetchMySongRequests, fetchAllSongRequests, voteRequest } from '@/store/slices/songSlice';
import SongRequestList from '@/components/songs/SongRequestList';
import Button from '@/components/common/Button';
import Select from '@/components/common/Select';
import Tabs from '@/components/common/Tabs';
import Loader from '@/components/common/Loader';
import { toast } from 'react-hot-toast';

const MyRequestsPage = () => {
  const dispatch = useDispatch();
  const { myRequests, allRequests, pagination, loading } = useSelector((state) => state.songs);
  const [activeTab, setActiveTab] = useState('my');
  const [status, setStatus] = useState('');

  console.log('📋 MyRequestsPage - My Requests:', myRequests?.length);
  console.log('📋 MyRequestsPage - All Requests:', allRequests?.length);
  console.log('📋 MyRequestsPage - Loading:', loading);

  useEffect(() => {
    fetchRequests();
  }, [activeTab, status]);

  const fetchRequests = (page = 1) => {
    const params = {
      page,
      limit: 9,
      ...(status && { status }),
    };
    
    if (activeTab === 'my') {
      console.log('📡 Fetching MY requests with params:', params);
      dispatch(fetchMySongRequests(params));
    } else {
      console.log('📡 Fetching ALL requests with params:', params);
      dispatch(fetchAllSongRequests(params));
    }
  };

  const handleVote = async (requestId) => {
    try {
      await dispatch(voteRequest(requestId)).unwrap();
      toast.success('Vote recorded!');
    } catch (error) {
      toast.error(error || 'Failed to vote');
    }
  };

  const handleRefresh = () => {
    fetchRequests();
    toast.success('Refreshed!');
  };

  const tabs = [
    { id: 'my', label: 'My Requests' },
    { id: 'all', label: 'All Requests' },
  ];

  // Determine which data to show based on active tab
  const requests = activeTab === 'my' ? (myRequests || []) : (allRequests || []);

  if (loading && requests.length === 0) {
    return <Loader fullScreen text="Loading your requests..." />;
  }

  return (
    <>
      <Helmet>
        <title>Song Requests - New Band Fellowship</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div>
              <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white mb-2">
                Song Requests
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                View and manage song requests
              </p>
            </div>
            
            <Link to="/request-song" className="mt-4 sm:mt-0">
              <Button variant="primary" icon={PlusIcon}>
                New Request
              </Button>
            </Link>
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft p-4 mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Tabs */}
              <div className="flex-1">
                <Tabs
                  tabs={tabs}
                  activeTab={activeTab}
                  onChange={setActiveTab}
                />
              </div>

              {/* Status Filter */}
              <div className="w-full sm:w-48">
                <Select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  options={[
                    { value: '', label: 'All Status' },
                    { value: 'PENDING', label: 'Pending' },
                    { value: 'SCHEDULED', label: 'Scheduled' },
                    { value: 'SUNG', label: 'Sung' },
                    { value: 'REJECTED', label: 'Rejected' },
                  ]}
                  icon={FunnelIcon}
                />
              </div>

              {/* Refresh Button */}
              <Button
                variant="outline"
                onClick={handleRefresh}
                icon={ArrowPathIcon}
              >
                Refresh
              </Button>
            </div>
          </div>

          {/* Requests List */}
          {requests.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl">
              <MusicalNoteIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                No Song Requests Yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {activeTab === 'my' 
                  ? "You haven't made any song requests yet."
                  : "No song requests have been made yet."}
              </p>
              {activeTab === 'my' && (
                <Link to="/request-song">
                  <Button variant="primary">Request a Song</Button>
                </Link>
              )}
            </div>
          ) : (
            <SongRequestList
              requests={requests}
              loading={loading}
              onVote={handleVote}
              showLoadMore={pagination?.page < pagination?.pages}
              hasMore={pagination?.page < pagination?.pages}
              onLoadMore={() => fetchRequests(pagination.page + 1)}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default MyRequestsPage;