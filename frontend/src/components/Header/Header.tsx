import React from 'react';
import './Header.css';

interface HeaderProps {
  title?: string;
  onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  title = "GreenGuest", 
  onMenuClick 
}) => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-brand">
          <div className="logo">
            <span className="logo-icon">🌱</span>
            <h1 className="logo-text">{title}</h1>
          </div>
        </div>
        
        <nav className="header-nav">
          <ul className="nav-list">
            <li><a href="#home" className="nav-link">Home</a></li>
            <li><a href="#sustainability" className="nav-link">Sustainability</a></li>
            <li><a href="#eco-tips" className="nav-link">Eco Tips</a></li>
            <li><a href="#community" className="nav-link">Community</a></li>
            <li><a href="#about" className="nav-link">About</a></li>
          </ul>
        </nav>

        <div className="header-actions">
          <button className="btn btn-primary">Get Started</button>
          {onMenuClick && (
            <button className="menu-toggle" onClick={onMenuClick}>
              <span></span>
              <span></span>
              <span></span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header; 