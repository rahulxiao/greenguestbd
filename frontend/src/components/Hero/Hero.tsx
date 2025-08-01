import React from 'react';
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
    <section className="relative bg-gradient-to-br from-green-50 to-green-100 py-20 overflow-hidden">
      {backgroundImage && (
        <div className="absolute inset-0">
          <img src={backgroundImage} alt="Hero background" className="w-full h-full object-cover" />
          {overlay && <div className="absolute inset-0 bg-black/20"></div>}
        </div>
      )}
      
      <div className="relative z-10">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              {subtitle && (
                <p className="text-lg text-green-600 font-medium mb-4">{subtitle}</p>
              )}
              
              <h1 className="text-5xl lg:text-6xl font-bold text-green-800 mb-6 leading-tight">{title}</h1>
              
              {description && (
                <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">{description}</p>
              )}
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
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
            
            <div className="flex justify-center lg:justify-end">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center">
                    <span className="text-4xl mb-2 block">🌿</span>
                    <span className="text-sm font-medium text-green-800">Eco-Friendly</span>
                  </div>
                  <div className="text-center">
                    <span className="text-4xl mb-2 block">♻️</span>
                    <span className="text-sm font-medium text-green-800">Sustainable</span>
                  </div>
                  <div className="text-center">
                    <span className="text-4xl mb-2 block">🌍</span>
                    <span className="text-sm font-medium text-green-800">Green Future</span>
                  </div>
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