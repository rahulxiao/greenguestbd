import React from 'react';

interface CardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  image?: string;
  imageAlt?: string;
  onClick?: () => void;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined' | 'product';
  size?: 'small' | 'medium' | 'large';
}

const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  children,
  image,
  imageAlt,
  onClick,
  className = '',
  variant = 'default',
  size = 'medium'
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'default':
        return 'bg-white shadow-md border border-gray-100';
      case 'elevated':
        return 'bg-white shadow-xl border border-gray-100 hover:shadow-2xl';
      case 'outlined':
        return 'bg-white border-2 border-green-200 shadow-none hover:border-green-300';
      case 'product':
        return 'bg-gradient-to-br from-white via-green-50/30 to-emerald-50/50 shadow-lg border border-green-100/50 hover:shadow-2xl hover:shadow-green-200/30 hover:border-green-200 hover:-translate-y-2';
      default:
        return 'bg-white shadow-md border border-gray-100';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'max-w-[280px] w-full';
      case 'medium':
        return 'max-w-[400px] w-full';
      case 'large':
        return 'max-w-[600px] w-full';
      default:
        return 'max-w-[400px] w-full';
    }
  };

  const cardClasses = [
    'rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-500 ease-out font-sans relative',
    getVariantClasses(),
    getSizeClasses(),
    onClick ? 'cursor-pointer' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClasses} onClick={onClick}>
      {/* Decorative background pattern for product cards */}
      {variant === 'product' && (
        <div className="absolute inset-0 bg-gradient-to-br from-green-100/20 via-transparent to-emerald-100/20 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
      )}
      
      {image && (
        <div className="w-full h-32 sm:h-40 md:h-48 overflow-hidden relative">
          <img 
            src={image} 
            alt={imageAlt || title || 'Card image'} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          />
          {/* Image overlay for product cards */}
          {variant === 'product' && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          )}
        </div>
      )}
      
      <div className="p-4 sm:p-6 relative z-10">
        {title && (
          <h3 className={`text-lg sm:text-xl font-bold mb-2 leading-tight ${
            variant === 'product' 
              ? 'text-green-800 hover:text-green-700 transition-colors duration-300' 
              : 'text-green-800'
          }`}>
            {title}
          </h3>
        )}
        
        {subtitle && (
          <p className="text-sm text-gray-600 font-medium mb-3 sm:mb-4">{subtitle}</p>
        )}
        
        <div className={`leading-relaxed text-sm sm:text-base ${
          variant === 'product' ? 'text-green-700' : 'text-gray-700'
        }`}>
          {children}
        </div>
      </div>
      
      {/* Enhanced decorative elements for product cards */}
      {variant === 'product' && (
        <>
          <div className="absolute top-3 left-3 w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full opacity-60 animate-pulse"></div>
          <div className="absolute top-3 right-3 w-1 h-1 bg-emerald-300 rounded-full opacity-40"></div>
          <div className="absolute bottom-3 left-3 w-1 h-1 bg-green-300 rounded-full opacity-40"></div>
          <div className="absolute bottom-3 right-3 w-1.5 h-1.5 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full opacity-50"></div>
        </>
      )}
    </div>
  );
};

export default Card; 