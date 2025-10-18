import { SelectHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils';
import { ChevronDownIcon } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children' | 'onChange'> {
  label?: string;
  helperText?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
  variant?: 'default' | 'filled';
  onChange?: (value: string) => void;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      helperText,
      error,
      options,
      placeholder,
      variant = 'default',
      id,
      onChange,
      ...props
    },
    ref
  ) => {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-medium text-gray-700 mb-1.5"
          >
            {label}
          </label>
        )}

        {/* Select Container */}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              // Base styles
              'block w-full rounded-md border transition-colors duration-200 appearance-none cursor-pointer',
              'focus:outline-none focus:ring-1 focus:ring-offset-0',
              'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
              
              // Variant styles
              variant === 'default' && [
                'bg-white border-gray-300 text-gray-900',
                'focus:border-blue-500 focus:ring-blue-500/20',
                'hover:border-gray-400',
              ],
              
              variant === 'filled' && [
                'bg-gray-50 border-gray-200 text-gray-900',
                'focus:bg-white focus:border-blue-500 focus:ring-blue-500/20',
                'hover:border-gray-300',
              ],
              
              // Error state
              error && [
                'border-red-300 text-red-900',
                'focus:border-red-500 focus:ring-red-500/20',
              ],
              
              // Size and padding - reduced height
              'px-3 py-2.5 pr-9 text-xs h-9',
              
              className
            )}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              error 
                ? `${selectId}-error` 
                : helperText 
                ? `${selectId}-helper` 
                : undefined
            }
            onChange={onChange ? (e) => onChange(e.target.value) : undefined}
            {...props}
          >
            {/* Placeholder option */}
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            
            {/* Options */}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>

          {/* Dropdown Icon */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none">
            <ChevronDownIcon className="h-4 w-4 text-gray-400" />
          </div>
        </div>

        {/* Helper Text or Error */}
        {(helperText || error) && (
          <div className="mt-1.5">
            {error ? (
              <p
                id={`${selectId}-error`}
                className="text-xs text-red-600"
              >
                {error}
              </p>
            ) : (
              helperText && (
                <p
                  id={`${selectId}-helper`}
                  className="text-xs text-gray-500"
                >
                  {helperText}
                </p>
              )
            )}
          </div>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';