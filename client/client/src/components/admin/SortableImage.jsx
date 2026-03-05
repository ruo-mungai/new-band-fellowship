import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Bars3Icon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const SortableImage = ({ id, image, index, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group rounded-lg overflow-hidden ${
        isDragging ? 'shadow-lg' : ''
      }`}
    >
      <img
        src={image.imageUrl}
        alt={image.title}
        className="w-full h-48 object-cover"
      />
      
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300" />
      
      <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div
          {...attributes}
          {...listeners}
          className="cursor-move p-2 bg-white rounded-lg shadow-lg hover:bg-gray-100 transition-colors"
        >
          <Bars3Icon className="h-4 w-4 text-gray-600" />
        </div>
      </div>
      
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
        <button
          onClick={onEdit}
          className="p-2 bg-white rounded-lg shadow-lg hover:bg-gray-100 transition-colors"
        >
          <PencilIcon className="h-4 w-4 text-gray-600" />
        </button>
        <button
          onClick={onDelete}
          className="p-2 bg-white rounded-lg shadow-lg hover:bg-gray-100 transition-colors"
        >
          <TrashIcon className="h-4 w-4 text-red-600" />
        </button>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent">
        <p className="text-white font-medium truncate">{image.title}</p>
        {image.description && (
          <p className="text-white text-sm truncate opacity-75">{image.description}</p>
        )}
      </div>
      
      <div className="absolute top-2 left-12 bg-primary-600 text-white px-2 py-1 rounded-full text-xs">
        #{index + 1}
      </div>
    </div>
  );
};

export default SortableImage;