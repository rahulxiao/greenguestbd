# GreenGuest Components

A comprehensive set of reusable React components designed for eco-friendly and sustainability-focused applications.

## Components Overview

### 🎯 Core Components

#### Header
A responsive navigation header with branding and menu functionality.

```tsx
import { Header } from './components';

<Header 
  title="GreenGuest" 
  onMenuClick={() => console.log('Menu clicked')} 
/>
```

**Props:**
- `title?: string` - Company/brand name (default: "GreenGuest")
- `onMenuClick?: () => void` - Mobile menu click handler

#### Hero
A hero section component for landing pages with call-to-action buttons.

```tsx
import { Hero } from './components';

<Hero
  title="Welcome to GreenGuest"
  subtitle="Sustainable Living Made Simple"
  description="Join thousands of eco-conscious individuals..."
  primaryAction={{
    text: "Get Started",
    onClick: () => console.log('Primary action')
  }}
  secondaryAction={{
    text: "Learn More", 
    onClick: () => console.log('Secondary action')
  }}
/>
```

**Props:**
- `title: string` - Main headline
- `subtitle?: string` - Subtitle text
- `description?: string` - Description text
- `primaryAction?: { text: string; onClick: () => void }` - Primary CTA
- `secondaryAction?: { text: string; onClick: () => void }` - Secondary CTA
- `backgroundImage?: string` - Background image URL
- `overlay?: boolean` - Show overlay on background (default: true)

#### Footer
A comprehensive footer with links, social media, and company information.

```tsx
import { Footer } from './components';

<Footer companyName="GreenGuest" year={2024} />
```

**Props:**
- `companyName?: string` - Company name (default: "GreenGuest")
- `year?: number` - Copyright year (default: current year)

### 🎨 UI Components

#### Button
A versatile button component with multiple variants and states.

```tsx
import { Button } from './components';

<Button 
  variant="primary" 
  size="medium" 
  onClick={() => console.log('Clicked')}
  loading={false}
  disabled={false}
  fullWidth={false}
>
  Click Me
</Button>
```

**Props:**
- `children: React.ReactNode` - Button content
- `variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'` - Button style
- `size?: 'small' | 'medium' | 'large'` - Button size
- `disabled?: boolean` - Disabled state
- `loading?: boolean` - Loading state with spinner
- `fullWidth?: boolean` - Full width button
- `icon?: React.ReactNode` - Icon element
- `iconPosition?: 'left' | 'right'` - Icon position
- `onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void` - Click handler
- `type?: 'button' | 'submit' | 'reset'` - Button type
- `className?: string` - Additional CSS classes

#### Card
A flexible card component for displaying content.

```tsx
import { Card } from './components';

<Card
  title="Card Title"
  subtitle="Card subtitle"
  variant="elevated"
  size="medium"
  onClick={() => console.log('Card clicked')}
>
  <p>Card content goes here...</p>
</Card>
```

**Props:**
- `title?: string` - Card title
- `subtitle?: string` - Card subtitle
- `children: React.ReactNode` - Card content
- `image?: string` - Card image URL
- `imageAlt?: string` - Image alt text
- `onClick?: () => void` - Click handler
- `className?: string` - Additional CSS classes
- `variant?: 'default' | 'elevated' | 'outlined'` - Card style
- `size?: 'small' | 'medium' | 'large'` - Card size

#### Input
A form input component with validation states and icons.

```tsx
import { Input } from './components';

<Input
  label="Email Address"
  type="email"
  placeholder="Enter your email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  required
  fullWidth
  error="Invalid email address"
  icon="📧"
/>
```

**Props:**
- `type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'` - Input type
- `placeholder?: string` - Placeholder text
- `value?: string` - Input value
- `defaultValue?: string` - Default value
- `label?: string` - Input label
- `error?: string` - Error message
- `helperText?: string` - Helper text
- `disabled?: boolean` - Disabled state
- `required?: boolean` - Required field
- `fullWidth?: boolean` - Full width input
- `size?: 'small' | 'medium' | 'large'` - Input size
- `variant?: 'default' | 'outlined' | 'filled'` - Input style
- `icon?: React.ReactNode` - Icon element
- `iconPosition?: 'left' | 'right'` - Icon position
- `onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void` - Change handler
- `onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void` - Focus handler
- `onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void` - Blur handler
- `onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void` - Key down handler
- `className?: string` - Additional CSS classes
- `id?: string` - Input ID
- `name?: string` - Input name
- `autoComplete?: string` - Autocomplete attribute
- `maxLength?: number` - Maximum length
- `minLength?: number` - Minimum length
- `pattern?: string` - Input pattern

## Design System

### Colors
- **Primary Green**: `#2d5a27` - Main brand color
- **Secondary Green**: `#4a7c59` - Secondary brand color
- **Light Green**: `#a8e6cf` - Accent color
- **Background**: `#f8fff8` - Light background
- **Text**: `#333` - Primary text color
- **Error**: `#e74c3c` - Error states

### Typography
- **Font Family**: System fonts (San Francisco, Segoe UI, Roboto)
- **Font Weights**: 400 (normal), 500 (medium), 600 (semibold), 700 (bold), 800 (extrabold)

### Spacing
- **Small**: 0.5rem (8px)
- **Medium**: 1rem (16px)
- **Large**: 1.5rem (24px)
- **Extra Large**: 2rem (32px)

## Usage Examples

### Complete Page Layout
```tsx
import React from 'react';
import { Header, Hero, Card, Button, Footer } from './components';

function HomePage() {
  return (
    <div className="App">
      <Header />
      
      <Hero
        title="Welcome to GreenGuest"
        subtitle="Sustainable Living Made Simple"
        description="Join our community of eco-conscious individuals."
        primaryAction={{
          text: "Get Started",
          onClick: () => console.log('Get Started')
        }}
      />
      
      <main>
        <Card title="Feature" variant="elevated">
          <p>Feature description</p>
          <Button variant="primary">Learn More</Button>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
}
```

### Form Example
```tsx
import React, { useState } from 'react';
import { Input, Button } from './components';

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Name"
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
        required
        fullWidth
      />
      
      <Input
        label="Email"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
        required
        fullWidth
      />
      
      <Input
        label="Message"
        value={formData.message}
        onChange={(e) => setFormData({...formData, message: e.target.value})}
        required
        fullWidth
      />
      
      <Button type="submit" variant="primary" fullWidth>
        Send Message
      </Button>
    </form>
  );
}
```

## Accessibility

All components are built with accessibility in mind:
- Proper ARIA labels and roles
- Keyboard navigation support
- Focus management
- Screen reader compatibility
- Color contrast compliance

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

When adding new components:
1. Create the component in its own directory
2. Include TypeScript interfaces for props
3. Add comprehensive CSS with responsive design
4. Create an index.ts file for easy importing
5. Update the main components index.ts
6. Add documentation to this README
7. Include accessibility features
8. Test across different screen sizes 