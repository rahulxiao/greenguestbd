import React from 'react';
import './Hero.css';
import Button from '../Button';

interface HeroProps {
  title: string;
  subtitle?: string;
  description?: string;
  primaryAction?: {
    text: string;
    onClick: () => void;
  };
  secondaryAction?: {
    text: string;
    onClick: () => void;
  };
  backgroundImage?: string;
  overlay?: boolean;
}

const Hero: React.FC<HeroProps> = ({
  title,
  subtitle,
  description,
  primaryAction,
  secondaryAction,
  backgroundImage,
  overlay = true
}) => {
  return (
    <section className="hero">
      {backgroundImage && (
        <div className="hero-background">
          <img src={backgroundImage} alt="Hero background" />
          {overlay && <div className="hero-overlay"></div>}
        </div>
      )}
      
      <div className="hero-content">
        <div className="hero-container">
          <div className="hero-text">
            {subtitle && (
              <p className="hero-subtitle">{subtitle}</p>
            )}
            
            <h1 className="hero-title">{title}</h1>
            
            {description && (
              <p className="hero-description">{description}</p>
            )}
            
            <div className="hero-actions">
              {primaryAction && (
                <Button
                  variant="primary"
                  size="large"
                  onClick={primaryAction.onClick}
                  icon="🌱"
                >
                  {primaryAction.text}
                </Button>
              )}
              
              {secondaryAction && (
                <Button
                  variant="outline"
                  size="large"
                  onClick={secondaryAction.onClick}
                >
                  {secondaryAction.text}
                </Button>
              )}
            </div>
          </div>
          
          <div className="hero-visual">
            <div className="hero-illustration">
              <div className="eco-stats">
                <div className="stat-item">
                  <span className="stat-number">🌿</span>
                  <span className="stat-label">Eco-Friendly</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">♻️</span>
                  <span className="stat-label">Sustainable</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">🌍</span>
                  <span className="stat-label">Green Future</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero; 