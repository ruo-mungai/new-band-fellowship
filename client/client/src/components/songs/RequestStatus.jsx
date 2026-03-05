import React from 'react';
import {
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';

const RequestStatus = ({ status }) => {
  const statusConfig = {
    PENDING: {
      icon: ClockIcon,
      text: 'Pending',
      className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    },
    SCHEDULED: {
      icon: CalendarIcon,
      text: 'Scheduled',
      className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    },
    SUNG: {
      icon: CheckCircleIcon,
      text: 'Sung',
      className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    },
    REJECTED: {
      icon: XCircleIcon,
      text: 'Rejected',
      className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    },
  };

  const config = statusConfig[status] || statusConfig.PENDING;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.className}`}>
      <Icon className="h-3 w-3 mr-1" />
      {config.text}
    </span>
  );
};

export default RequestStatus;