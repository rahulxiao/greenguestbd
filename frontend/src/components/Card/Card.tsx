import React from 'react';
import './Card.css';

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
  const cardClasses = [
    'card',
    `card--${variant}`,
    `card--${size}`,
    onClick ? 'card--clickable' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClasses} onClick={onClick}>
      {image && (
        <div className="card-image">
          <img src={image} alt={imageAlt || title || 'Card image'} />
        </div>
      )}
      
      <div className="card-content">
        {title && (
          <h3 className="card-title">{title}</h3>
        )}
        
        {subtitle && (
          <p className="card-subtitle">{subtitle}</p>
        )}
        
        <div className="card-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Card; 