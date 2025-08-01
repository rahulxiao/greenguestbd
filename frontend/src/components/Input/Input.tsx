import React, { forwardRef } from 'react';

interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  label?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  fullWidth?: boolean;
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'outlined' | 'filled';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  className?: string;
  id?: string;
  name?: string;
  autoComplete?: string;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  type = 'text',
  placeholder,
  value,
  defaultValue,
  label,
  error,
  helperText,
  disabled = false,
  required = false,
  fullWidth = false,
  size = 'medium',
  variant = 'default',
  icon,
  iconPosition = 'left',
  onChange,
  onFocus,
  onBlur,
  onKeyDown,
  className = '',
  id,
  name,
  autoComplete,
  maxLength,
  minLength,
  pattern,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  const getVariantClasses = () => {
    switch (variant) {
      case 'default':
        return 'border-gray-300 bg-white focus:border-green-800 focus:ring-green-800/10';
      case 'outlined':
        return 'border-green-800 bg-transparent focus:border-green-800 focus:ring-green-800/10';
      case 'filled':
        return 'border-transparent bg-gray-50 focus:bg-white focus:border-green-800 focus:ring-green-800/10';
      default:
        return 'border-gray-300 bg-white focus:border-green-800 focus:ring-green-800/10';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'px-3 py-2 text-sm min-h-[36px]';
      case 'medium':
        return 'px-4 py-3 text-base min-h-[44px]';
      case 'large':
        return 'px-5 py-4 text-lg min-h-[52px]';
      default:
        return 'px-4 py-3 text-base min-h-[44px]';
    }
  };

  const inputClasses = [
    'w-full border-2 rounded-lg font-inherit transition-all duration-300 outline-none',
    getVariantClasses(),
    getSizeClasses(),
    fullWidth ? 'w-full' : '',
    disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed border-gray-300' : '',
    error ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-500/10' : '',
    icon ? (iconPosition === 'left' ? 'pl-10' : 'pr-10') : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="flex flex-col gap-2 font-sans">
      {label && (
        <label htmlFor={inputId} className="font-semibold text-green-800 text-sm flex items-center gap-1">
          {label}
          {required && <span className="text-red-500 font-bold">*</span>}
        </label>
      )}
      
      <div className="relative flex items-center">
        {icon && iconPosition === 'left' && (
          <span className="absolute left-3 flex items-center justify-center text-gray-500 text-xl pointer-events-none z-10">{icon}</span>
        )}
        
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={inputClasses}
          placeholder={placeholder}
          value={value}
          defaultValue={defaultValue}
          disabled={disabled}
          required={required}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          name={name}
          autoComplete={autoComplete}
          maxLength={maxLength}
          minLength={minLength}
          pattern={pattern}
          {...props}
        />
        
        {icon && iconPosition === 'right' && (
          <span className="absolute right-3 flex items-center justify-center text-gray-500 text-xl pointer-events-none z-10">{icon}</span>
        )}
      </div>
      
      {(error || helperText) && (
        <div className={`text-sm leading-relaxed mt-1 ${error ? 'text-red-500 font-medium' : 'text-gray-600'}`}>
          {error || helperText}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input; 