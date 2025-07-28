import React, { useState } from 'react';
import './App.css';
import { Header, Card, Button, Input, Hero, Footer } from './components';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleGetStarted = () => {
    alert('Get Started clicked!');
  };

  const handleLearnMore = () => {
    alert('Learn More clicked!');
  };

  const handleMenuClick = () => {
    alert('Mobile menu clicked!');
  };

  return (
    <div className="App">
      <Header onMenuClick={handleMenuClick} />
      
      <Hero
        title="Welcome to GreenGuest"
        subtitle="Sustainable Living Made Simple"
        description="Join thousands of eco-conscious individuals making a positive impact on our planet. Discover practical tips, track your sustainability journey, and connect with like-minded people."
        primaryAction={{
          text: "Start Your Journey",
          onClick: handleGetStarted
        }}
        secondaryAction={{
          text: "Learn More",
          onClick: handleLearnMore
        }}
      />

      <main className="main-content">
        <section className="features-section">
          <div className="container">
            <h2 className="section-title">Why Choose GreenGuest?</h2>
            <div className="features-grid">
              <Card
                title="🌱 Eco-Friendly Tips"
                subtitle="Daily inspiration"
                variant="elevated"
                size="medium"
              >
                <p>Get personalized tips and tricks to reduce your carbon footprint and live more sustainably every day.</p>
                <div className="card-button-wrapper">
                  <Button variant="outline" size="small">
                    Explore Tips
                  </Button>
                </div>
              </Card>

              <Card
                title="📊 Track Progress"
                subtitle="Monitor your impact"
                variant="elevated"
                size="medium"
              >
                <p>Track your sustainability metrics and see the real impact of your eco-friendly choices over time.</p>
                <div className="card-button-wrapper">
                  <Button variant="outline" size="small">
                    View Dashboard
                  </Button>
                </div>
              </Card>

              <Card
                title="🤝 Community"
                subtitle="Connect & share"
                variant="elevated"
                size="medium"
              >
                <p>Join a community of environmentally conscious individuals sharing ideas and supporting each other.</p>
                <div className="card-button-wrapper">
                  <Button variant="outline" size="small">
                    Join Community
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </section>

        <section className="demo-section">
          <div className="container">
            <h2 className="section-title">Component Showcase</h2>
            
            <div className="demo-grid">
              <div className="demo-item">
                <h3>Buttons</h3>
                <div className="button-demo">
                  <Button variant="primary" size="small">Small Primary</Button>
                  <Button variant="secondary" size="medium">Medium Secondary</Button>
                  <Button variant="outline" size="large">Large Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="danger">Danger</Button>
                  <Button loading>Loading</Button>
                </div>
              </div>

              <div className="demo-item">
                <h3>Input Fields</h3>
                <div className="input-demo">
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    fullWidth
                  />
                  <Input
                    label="Password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error="Password must be at least 8 characters"
                    fullWidth
                  />
                  <Input
                    label="Search"
                    type="search"
                    placeholder="Search for eco tips..."
                    icon="🔍"
                    fullWidth
                  />
                </div>
              </div>

              <div className="demo-item">
                <h3>Cards</h3>
                <div className="card-demo">
                  <Card
                    title="Default Card"
                    subtitle="Basic card example"
                    size="small"
                  >
                    <p>This is a default card with some content.</p>
                  </Card>
                  
                  <Card
                    title="Outlined Card"
                    subtitle="With border styling"
                    variant="outlined"
                    size="small"
                  >
                    <p>This card has an outlined style.</p>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default App;
