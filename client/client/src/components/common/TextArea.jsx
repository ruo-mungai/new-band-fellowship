import React, { forwardRef } from 'react';

const TextArea = forwardRef(({
  label,
  error,
  rows = 4,
  className = '',
  ...props
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        rows={rows}
        className={`
          w-full px-4 py-2 border rounded-lg 
          focus:ring-2 focus:ring-primary-500 focus:border-transparent 
          dark:bg-gray-700 dark:text-white
          transition-colors duration-200
          resize-none
          ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
});

TextArea.displayName = 'TextArea';

export default TextArea;