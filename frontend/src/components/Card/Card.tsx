import React from 'react';

interface CardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  image?: string;
  imageAlt?: string;
  onClick?: () => void;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined';
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
        return 'bg-white shadow-md';
      case 'elevated':
        return 'bg-white shadow-xl';
      case 'outlined':
        return 'bg-white border-2 border-green-200 shadow-none';
      default:
        return 'bg-white shadow-md';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'max-w-[280px]';
      case 'medium':
        return 'max-w-[400px]';
      case 'large':
        return 'max-w-[600px]';
      default:
        return 'max-w-[400px]';
    }
  };

  const cardClasses = [
    'bg-white rounded-xl overflow-hidden transition-all duration-300 font-sans',
    getVariantClasses(),
    getSizeClasses(),
    onClick ? 'cursor-pointer hover:-translate-y-1 hover:shadow-2xl' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClasses} onClick={onClick}>
      {image && (
        <div className="w-full h-48 overflow-hidden relative">
          <img 
            src={image} 
            alt={imageAlt || title || 'Card image'} 
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      )}
      
      <div className="p-6">
        {title && (
          <h3 className="text-xl font-semibold text-green-800 mb-2 leading-tight">{title}</h3>
        )}
        
        {subtitle && (
          <p className="text-sm text-gray-600 font-medium mb-4">{subtitle}</p>
        )}
        
        <div className="text-gray-700 leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Card; 