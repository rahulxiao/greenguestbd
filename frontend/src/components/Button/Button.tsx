import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  onClick,
  type = 'button',
  className = ''
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-br from-green-800 to-green-600 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5';
      case 'secondary':
        return 'bg-gradient-to-br from-green-300 to-teal-300 text-green-800 shadow-lg hover:shadow-xl hover:-translate-y-0.5';
      case 'outline':
        return 'bg-transparent text-green-800 border-2 border-green-800 hover:bg-green-800 hover:text-white hover:-translate-y-0.5';
      case 'ghost':
        return 'bg-transparent text-green-800 hover:bg-green-800/10 hover:-translate-y-0.5';
      case 'danger':
        return 'bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5';
      default:
        return 'bg-gradient-to-br from-green-800 to-green-600 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'px-4 py-2 text-sm min-h-[36px]';
      case 'medium':
        return 'px-6 py-3 text-base min-h-[44px]';
      case 'large':
        return 'px-8 py-4 text-lg min-h-[52px]';
      default:
        return 'px-6 py-3 text-base min-h-[44px]';
    }
  };

  const buttonClasses = [
    'inline-flex items-center justify-center gap-2 border-none rounded-lg font-semibold cursor-pointer transition-all duration-300 ease-in-out font-inherit relative overflow-hidden',
    getVariantClasses(),
    getSizeClasses(),
    fullWidth ? 'w-full' : '',
    disabled ? 'opacity-60 cursor-not-allowed hover:transform-none hover:shadow-none' : '',
    loading ? 'cursor-wait' : '',
    className
  ].filter(Boolean).join(' ');

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && !loading && onClick) {
      onClick(event);
    }
  };

  return (
    <button
      className={buttonClasses}
      onClick={handleClick}
      disabled={disabled || loading}
      type={type}
    >
      {loading && (
        <span className="flex items-center justify-center w-4 h-4 animate-spin">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="31.416" strokeDashoffset="31.416">
              <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416" repeatCount="indefinite"/>
              <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416" repeatCount="indefinite"/>
            </circle>
          </svg>
        </span>
      )}
      
      {!loading && icon && iconPosition === 'left' && (
        <span className="flex items-center justify-center text-xl mr-1">{icon}</span>
      )}
      
      <span className="flex items-center gap-2">{children}</span>
      
      {!loading && icon && iconPosition === 'right' && (
        <span className="flex items-center justify-center text-xl ml-1">{icon}</span>
      )}
    </button>
  );
};

export default Button; 