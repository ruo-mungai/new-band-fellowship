import React, { forwardRef } from 'react';

const Select = forwardRef(({
  label,
  error,
  options = [],
  icon: Icon,
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
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        <select
          ref={ref}
          className={`
            w-full px-4 py-2 border rounded-lg 
            focus:ring-2 focus:ring-primary-500 focus:border-transparent 
            dark:bg-gray-700 dark:text-white
            transition-colors duration-200
            ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
            ${Icon ? 'pl-10' : ''}
            ${className}
          `}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;