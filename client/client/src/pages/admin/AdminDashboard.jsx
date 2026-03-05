import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  UsersIcon,
  MusicalNoteIcon,
  CalendarIcon,
  NewspaperIcon,
  PhotoIcon,
  ChatBubbleLeftIcon,
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import StatsCard from '@/components/admin/StatsCard';
import Card from '@/components/common/Card';
import { adminService } from '@/services/adminService';
import Loader from '@/components/common/Loader';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await adminService.getDashboard();
      console.log('Dashboard data:', data);
      setStats(data.stats || {});
      setRecentActivity(data.recentActivity || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError(error.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Create Event',
      description: 'Schedule a new fellowship event',
      icon: CalendarIcon,
      href: '/admin/events/new',
      color: 'bg-blue-500',
    },
    {
      title: 'Add Blog Post',
      description: 'Share news and devotionals',
      icon: NewspaperIcon,
      href: '/admin/blogs/new',
      color: 'bg-green-500',
    },
    {
      title: 'Manage Requests',
      description: 'Review song requests',
      icon: MusicalNoteIcon,
      href: '/admin/requests',
      color: 'bg-purple-500',
    },
    {
      title: 'Update Gallery',
      description: 'Add new fellowship photos',
      icon: PhotoIcon,
      href: '/admin/gallery',
      color: 'bg-pink-500',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Welcome back! Here's what's happening with your fellowship.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          icon={UsersIcon}
          change={12}
          changeType="increase"
          color="primary"
        />
        <StatsCard
          title="Song Requests"
          value={stats?.totalRequests || 0}
          icon={MusicalNoteIcon}
          change={8}
          changeType="increase"
          color="green"
        />
        <StatsCard
          title="Upcoming Events"
          value={stats?.upcomingEvents || 0}
          icon={CalendarIcon}
          change={2}
          changeType="increase"
          color="blue"
        />
        <StatsCard
          title="Blog Posts"
          value={stats?.totalBlogs || 0}
          icon={NewspaperIcon}
          change={5}
          changeType="decrease"
          color="purple"
        />
      </div>

      {/* Quick Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">System Overview</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="text-gray-600 dark:text-gray-400">Pending Users</span>
              <span className="font-bold text-gray-900 dark:text-white">{stats?.pendingUsers || 0}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="text-gray-600 dark:text-gray-400">Pending Requests</span>
              <span className="font-bold text-gray-900 dark:text-white">{stats?.pendingRequests || 0}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="text-gray-600 dark:text-gray-400">Total Comments</span>
              <span className="font-bold text-gray-900 dark:text-white">{stats?.totalComments || 0}</span>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Request Status</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <span className="text-yellow-700 dark:text-yellow-300">Pending</span>
              <span className="font-bold text-yellow-700 dark:text-yellow-300">{stats?.pendingRequests || 12}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <span className="text-blue-700 dark:text-blue-300">Scheduled</span>
              <span className="font-bold text-blue-700 dark:text-blue-300">19</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <span className="text-green-700 dark:text-green-300">Sung</span>
              <span className="font-bold text-green-700 dark:text-green-300">8</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <span className="text-red-700 dark:text-red-300">Rejected</span>
              <span className="font-bold text-red-700 dark:text-red-300">3</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.title}
                to={action.href}
                className="group block"
              >
                <Card className="hover:shadow-soft-lg transition-all duration-300">
                  <div className="flex items-start space-x-4">
                    <div className={`${action.color} p-3 rounded-lg text-white`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Recent Activity
        </h3>
        <div className="space-y-4">
          {recentActivity.length > 0 ? (
            recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-0"
              >
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 rounded-full bg-primary-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {activity.timestamp ? format(new Date(activity.timestamp), 'PPp') : 'Just now'}
                    </p>
                  </div>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  activity.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                  activity.type === 'warning' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                  'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                }`}>
                  {activity.action || 'INFO'}
                </span>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 py-4">
              No recent activity
            </p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;