# BonsaiMarket Frontend

A modern React TypeScript frontend for the BonsaiMarket e-commerce platform.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Backend API running on port 3333

### Installation
```bash
npm install
```

### Environment Setup
Create a `.env` file in the frontend root directory:

```env
# Backend API Configuration
REACT_APP_API_URL=http://localhost:3333/api

# Frontend Configuration  
REACT_APP_FRONTEND_URL=http://localhost:3000
```

### Development
```bash
npm start
```

The app will run on [http://localhost:3000](http://localhost:3000)

## 🔧 Backend Connection

The frontend is now fully connected to the backend API with the following services:

- **Authentication** (`/api/auth`) - Login, register, profile management
- **Products** (`/api/products`) - Product CRUD, search, filtering
- **Cart** (`/api/cart`) - Shopping cart management
- **Orders** (`/api/orders`) - Order creation and management
- **Wishlist** (`/api/wishlist`) - Wishlist functionality
- **Reviews** (`/api/reviews`) - Product reviews and ratings

## 📱 Features

- **Mobile-First Design** - Fully responsive across all devices
- **Real-time API Integration** - Live data from backend
- **Authentication System** - JWT-based user management
- **Product Management** - Search, filter, and browse products
- **Shopping Cart** - Add, remove, and manage cart items
- **Order Management** - Complete order workflow
- **User Profiles** - Manage personal information
- **Admin Dashboard** - Business analytics and management

## 🏗️ Architecture

- **React 18** with TypeScript
- **Service Layer** - Centralized API communication
- **Component Library** - Reusable UI components
- **State Management** - React hooks and context
- **Routing** - React Router v6
- **Styling** - Tailwind CSS with custom components

## 🔌 API Services

All API calls are handled through the service layer:

```typescript
import { productService, authService, cartService } from '../services';

// Example usage
const products = await productService.getAllProducts();
const user = await authService.login(credentials);
```

## 📱 Mobile Optimization

- Collapsible filters and navigation
- Touch-friendly controls
- Optimized spacing and typography
- Responsive grid layouts
- Mobile-first component design

## 🚀 Deployment

Build for production:
```bash
npm run build
```

The built files will be in the `build/` directory.

## 🔒 Security

- JWT token authentication
- Secure API communication
- Input validation and sanitization
- CORS configuration
- Environment variable protection

## 📚 Documentation

- **Components**: See `src/components/` for reusable UI components
- **Services**: See `src/services/` for API integration
- **Pages**: See `src/pages/` for main application views
- **Types**: See service files for TypeScript interfaces

## 🤝 Contributing

1. Follow the existing code style
2. Add TypeScript types for new features
3. Ensure mobile responsiveness
4. Test API integration
5. Update documentation as needed

## 📞 Support

For backend integration issues, check:
- Backend server is running on port 3333
- CORS configuration in backend
- Environment variables are set correctly
- Network connectivity between frontend and backend
