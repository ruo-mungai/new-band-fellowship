import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { CalendarIcon, MapPinIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';

const EventCard = ({ event }) => {
  const {
    id,
    title,
    description,
    eventDate,
    location,
    bannerImage,
    attendees = 0,
    maxAttendees,
  } = event;

  const isPast = new Date(eventDate) < new Date();
  const spotsLeft = maxAttendees ? maxAttendees - attendees : null;

  return (
    <Card className="h-full flex flex-col hover:shadow-soft-lg transition-all duration-300">
      {/* Image */}
      {bannerImage && (
        <div className="relative h-48 -m-6 mb-4 overflow-hidden">
          <img
            src={bannerImage}
            alt={title}
            className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
          />
          {isPast && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-bold text-lg bg-black/50 px-4 py-2 rounded-full">
                Past Event
              </span>
            </div>
          )}
        </div>
      )}

      <div className="flex-1">
        {/* Date Badge */}
        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200 mb-3">
          <CalendarIcon className="h-3 w-3 mr-1" />
          {format(new Date(eventDate), 'EEEE, MMMM d, yyyy')}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
          {title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
          {description}
        </p>

        {/* Details */}
        <div className="space-y-2 mb-4">
          {location && (
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <MapPinIcon className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="line-clamp-1">{location}</span>
            </div>
          )}
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <UserGroupIcon className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>
              {attendees} attending
              {spotsLeft !== null && spotsLeft > 0 && (
                <span className="ml-2 text-green-600 dark:text-green-400 font-medium">
                  ({spotsLeft} {spotsLeft === 1 ? 'spot' : 'spots'} left)
                </span>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Action Button - Always visible, links to event details */}
      <div className="mt-4">
        <Link to={`/events/${id}`}>
          <Button variant={isPast ? 'outline' : 'primary'} fullWidth>
            {isPast ? 'View Details' : 'View Event'}
          </Button>
        </Link>
      </div>
    </Card>
  );
};

export default EventCard;