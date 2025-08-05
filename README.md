# 🌳 BonsaiMarket Backend API

A comprehensive NestJS backend API for the BonsaiMarket e-commerce platform, specializing in bonsai trees, tools, and accessories.

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **User Management**: Complete user registration, login, and profile management with email verification
- **Product Management**: CRUD operations for bonsai products with categories and detailed specifications
- **Shopping Cart**: Add, remove, and manage cart items with quantity tracking
- **Wishlist**: Save and manage favorite products
- **Order Management**: Complete order processing with order items and status tracking
- **Admin Panel**: Comprehensive admin interface with separate admin entity and role management
- **Advanced Search & Filtering**: Full-text search with PostgreSQL, faceted search, autocomplete, and advanced filtering
- **Review & Rating System**: Complete review system with moderation, helpful votes, and rating calculations
- **Inventory Management**: Low stock alerts, supplier management, purchase orders, and automated reordering
- **Analytics & Monitoring**: User behavior tracking, sales analytics, performance monitoring, and system health checks
- **Rate Limiting & Security**: Request throttling, security headers, and abuse prevention
- **Caching System**: Redis-compatible caching for improved performance and user session management
- **Data Validation**: Comprehensive input validation using class-validator and class-transformer
- **Error Handling**: Global exception handling with consistent error responses
- **CORS Support**: Cross-origin resource sharing for frontend integration
- **Environment Configuration**: Flexible configuration management with ConfigModule
- **Database Integration**: PostgreSQL with TypeORM for robust data persistence
- **API Documentation**: Swagger/OpenAPI documentation support
- **Scheduled Tasks**: Automated daily metrics generation and inventory checks
- **Health Monitoring**: System health checks with database, memory, and disk monitoring

## 🛠️ Tech Stack

- **Framework**: NestJS v11.0.1
- **Database**: PostgreSQL with TypeORM v0.3.25
- **Authentication**: JWT with Passport.js and bcrypt for password hashing
- **Validation**: class-validator v0.14.2 & class-transformer v0.5.1
- **API Documentation**: Swagger/OpenAPI with @nestjs/swagger
- **Caching**: Cache Manager with Redis support
- **Rate Limiting**: @nestjs/throttler
- **Scheduling**: @nestjs/schedule
- **Health Checks**: @nestjs/terminus
- **Logging**: Winston with file rotation
- **Security**: Helmet for security headers
- **Environment**: ConfigModule for environment variables
- **Testing**: Jest for unit and e2e testing

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- Redis (optional, for enhanced caching)
- npm or yarn

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd greenguest
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=your-password
   DB_NAME=greenguest
   JWT_SECRET=your-super-secret-jwt-key
   PORT=3333
   FRONTEND_URL=http://localhost:3000
   NODE_ENV=development
   REDIS_URL=redis://localhost:6379
   ```

4. **Set up the database**
   ```bash
   # Create PostgreSQL database
   createdb greenguest
   ```

5. **Run the application**
   ```bash
   # Development mode
   npm run start:dev
   
   # Production mode
   npm run build
   npm run start:prod
   ```

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)
- `POST /api/auth/refresh` - Refresh JWT token (protected)
- `POST /api/auth/logout` - User logout

### User Endpoints

- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `DELETE /api/user/account` - Delete user account

### Product Endpoints

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Advanced Search Endpoints

- `GET /api/search` - Advanced product search with filters
- `GET /api/search/autocomplete` - Search autocomplete
- `GET /api/search/suggestions` - Search suggestions
- `GET /api/search/popular` - Popular searches

### Review & Rating Endpoints

- `POST /api/reviews/products/:productId` - Create review (authenticated)
- `GET /api/reviews/products/:productId` - Get product reviews
- `GET /api/reviews/products/:productId/rating` - Get rating summary
- `PUT /api/reviews/:id` - Update review (owner only)
- `DELETE /api/reviews/:id` - Delete review (owner only)
- `POST /api/reviews/:id/vote` - Vote on review helpfulness
- `PUT /api/reviews/:id/moderate` - Moderate review (admin only)
- `PUT /api/reviews/:id/verify` - Verify review (admin only)

### Cart Endpoints

- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/:id` - Update cart item
- `DELETE /api/cart/:id` - Remove item from cart
- `DELETE /api/cart/clear` - Clear cart

### Wishlist Endpoints

- `GET /api/wishlist` - Get user wishlist
- `POST /api/wishlist/add` - Add item to wishlist
- `DELETE /api/wishlist/:id` - Remove item from wishlist

### Order Endpoints

- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create order
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id/status` - Update order status (admin only)

### Inventory Management Endpoints

- `GET /api/inventory/suppliers` - Get suppliers (admin only)
- `POST /api/inventory/suppliers` - Create supplier (admin only)
- `GET /api/inventory/history/:productId` - Get inventory history (admin only)
- `GET /api/inventory/alerts/low-stock` - Get low stock alerts (admin only)
- `POST /api/inventory/purchase-orders` - Create purchase order (admin only)
- `GET /api/inventory/analytics` - Inventory analytics (admin only)

### Analytics Endpoints

- `GET /api/analytics/sales` - Sales analytics (admin only)
- `GET /api/analytics/user-behavior` - User behavior analytics (admin only)
- `GET /api/analytics/product/:productId` - Product performance (admin only)
- `GET /api/analytics/top-products` - Top performing products (admin only)
- `GET /api/analytics/search` - Search analytics (admin only)

### Admin Endpoints

- `GET /api/admin/users` - Get all users (admin only)
- `GET /api/admin/orders` - Get all orders (admin only)
- `GET /api/admin/stats` - Get platform statistics (admin only)
- `POST /api/admin/login` - Admin login
- `GET /api/admin/profile` - Get admin profile

### Health & Monitoring Endpoints

- `GET /api/health` - System health check
- `GET /api/analytics/health` - Analytics system health (admin only)

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 📊 Database Schema

### Users Table
- `id` (Primary Key)
- `firstName` (String)
- `lastName` (String)
- `email` (String, Unique)
- `password` (String, Hashed)
- `phoneNumber` (String, Optional)
- `isActive` (Boolean)
- `isEmailVerified` (Boolean)
- `emailVerificationToken` (String, Optional)
- `passwordResetToken` (String, Optional)
- `passwordResetExpires` (Date, Optional)
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

### Products Table
- `id` (Primary Key)
- `name` (String)
- `category` (String)
- `price` (Decimal, precision: 10, scale: 2)
- `description` (Text, Optional)
- `imageUrl` (String, Optional)
- `stock` (Integer)
- `available` (Boolean)
- `brand` (String, Optional)
- `sku` (String, Optional)
- `weight` (Decimal, Optional)
- `dimensions` (String, Optional)
- `specifications` (Text, Optional)
- `rating` (Decimal)
- `reviewCount` (Integer)
- `tags` (String, Optional)
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

### Reviews Table
- `id` (Primary Key)
- `userId` (Foreign Key)
- `productId` (Foreign Key)
- `rating` (Integer, 1-5)
- `comment` (Text)
- `title` (String, Optional)
- `isVerified` (Boolean)
- `isModerated` (Boolean)
- `helpfulVotes` (Integer)
- `totalVotes` (Integer)
- `images` (String Array, Optional)
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

### Admin Table
- `id` (Primary Key)
- `firstName` (String)
- `lastName` (String)
- `email` (String, Unique)
- `password` (String, Hashed)
- `phoneNumber` (String, Optional)
- `role` (String, Default: 'admin')
- `isActive` (Boolean)
- `lastLoginAt` (Date, Optional)
- `lastLoginIp` (String, Optional)
- `position` (String, Optional)
- `bio` (Text, Optional)
- `timezone` (String, Optional)
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

### Cart Items Table
- `id` (Primary Key)
- `userId` (Foreign Key)
- `productId` (Foreign Key)
- `quantity` (Integer)
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

### Wishlist Items Table
- `id` (Primary Key)
- `userId` (Foreign Key)
- `productId` (Foreign Key)
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

### Orders Table
- `id` (Primary Key)
- `userId` (Foreign Key)
- `status` (String)
- `totalAmount` (Decimal)
- `shippingAddress` (Text)
- `billingAddress` (Text)
- `paymentMethod` (String)
- `paymentStatus` (String)
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

### Order Items Table
- `id` (Primary Key)
- `orderId` (Foreign Key)
- `productId` (Foreign Key)
- `quantity` (Integer)
- `price` (Decimal)
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

### Analytics Tables
- **UserEvents**: Track user behavior and interactions
- **DailyMetrics**: Store daily aggregated metrics
- **ProductAnalytics**: Product performance tracking

### Inventory Tables
- **Suppliers**: Supplier information and management
- **InventoryHistory**: Complete inventory movement tracking
- **LowStockAlerts**: Automated low stock notifications
- **PurchaseOrders**: Purchase order management
- **PurchaseOrderItems**: Individual items in purchase orders

## 🔍 Advanced Search Features

### Full-Text Search
- PostgreSQL full-text search on product names, descriptions, and tags
- Configurable search relevance and ranking

### Faceted Search
- Filter by categories, brands, price ranges, and ratings
- Dynamic facet generation based on search results

### Advanced Filtering
- Price range filtering
- Rating filtering
- Availability filtering
- Brand and tag filtering
- Multiple filter combinations

### Sorting Options
- Sort by name, price, rating, creation date, review count
- Ascending and descending order support

### Autocomplete
- Real-time search suggestions
- Product, category, and brand suggestions
- Configurable suggestion limits

## ⭐ Review & Rating System

### Review Features
- 1-5 star rating system
- Detailed review comments and titles
- Review images support
- Review verification for purchase confirmation
- Review moderation for quality control

### Rating Calculations
- Average rating calculations
- Rating distribution analysis
- Verified review tracking
- Review count management

### Helpful Votes
- Users can vote on review helpfulness
- Helpful percentage calculations
- Review quality metrics

## 📦 Inventory Management

### Stock Management
- Real-time stock tracking
- Inventory history with complete audit trail
- Stock adjustments and corrections
- Negative stock prevention

### Low Stock Alerts
- Configurable stock thresholds
- Automated alert generation
- Alert resolution tracking
- Email notifications (configurable)

### Supplier Management
- Supplier information storage
- Supplier performance tracking
- Contact information management
- Supplier status tracking

### Purchase Orders
- Complete PO lifecycle management
- PO status tracking (draft, sent, confirmed, received, cancelled)
- Automated PO generation for low stock
- PO item tracking and receiving

### Automated Reordering
- Daily automated stock checks
- Configurable reorder thresholds
- Automated PO creation
- Smart reorder quantity calculations

## 📊 Analytics & Monitoring

### User Behavior Analytics
- Page view tracking
- Product interaction tracking
- Search behavior analysis
- User journey mapping

### Sales Analytics
- Daily, weekly, monthly sales tracking
- Revenue analysis and trends
- Order volume tracking
- Sales performance metrics

### Product Performance
- Product view tracking
- Add-to-cart rates
- Purchase conversion rates
- Revenue per product

### Search Analytics
- Search term frequency analysis
- Popular search terms
- Search conversion tracking
- Search performance optimization

### System Monitoring
- Database health checks
- Memory usage monitoring
- Disk space monitoring
- Application uptime tracking

## 🛡️ Security Features

### Rate Limiting
- Configurable request limits per minute
- IP-based rate limiting
- Endpoint-specific throttling
- Abuse prevention

### Security Headers
- Helmet.js for security headers
- XSS protection
- Content Security Policy
- HSTS enforcement

### Authentication
- JWT token-based authentication
- Role-based access control
- Token expiration management
- Secure password hashing

### Input Validation
- Comprehensive input validation
- SQL injection prevention
- XSS protection
- Data sanitization

## ⚡ Performance Features

### Caching System
- Redis-compatible caching
- Product cache for improved performance
- Search result caching
- Analytics data caching
- Configurable cache TTL

### Database Optimization
- Proper indexing for search queries
- Query optimization
- Connection pooling
- Efficient data retrieval

### Response Optimization
- Pagination for large datasets
- Efficient data serialization
- Compressed responses
- Optimized JSON structure

## 🧪 Testing

```bash
# Unit tests
npm run test

# e2e tests
npm run test:e2e

# Test coverage
npm run test:cov

# Test in watch mode
npm run test:watch
```

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_HOST` | Database host | localhost |
| `DB_PORT` | Database port | 5432 |
| `DB_USERNAME` | Database username | postgres |
| `DB_PASSWORD` | Database password | rahulxiao |
| `DB_NAME` | Database name | greenguest |
| `JWT_SECRET` | JWT secret key | your-secret-key |
| `JWT_EXPIRES_IN` | JWT expiration time | 24h |
| `PORT` | Application port | 3333 |
| `NODE_ENV` | Environment | development |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:3000 |
| `REDIS_URL` | Redis connection URL | redis://localhost:6379 |

## 🔧 Development

### Project Structure
```
src/
├── auth/                 # Authentication module
│   ├── dto/             # Data transfer objects
│   │   ├── auth-response.dto.ts
│   │   ├── login.dto.ts
│   │   └── register.dto.ts
│   ├── guards/          # Authentication guards
│   │   ├── jwt-auth.guard.ts
│   │   └── roles.guard.ts
│   ├── strategies/      # Passport strategies
│   │   └── jwt.strategy.ts
│   ├── decorators/      # Custom decorators
│   │   ├── roles.decorator.ts
│   │   └── user.decorator.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── auth.module.ts
├── user/                # User management
│   ├── user.entity.ts
│   ├── profile.entity.ts
│   ├── user.dto.ts
│   ├── user.service.ts
│   ├── user.controller.ts
│   └── user.module.ts
├── product/             # Product management
│   ├── product.entity.ts
│   ├── product.dto.ts
│   ├── product.service.ts
│   ├── product.controller.ts
│   └── product.module.ts
├── cart/                # Shopping cart
│   ├── cart-item.entity.ts
│   ├── cart.dto.ts
│   ├── cart.service.ts
│   ├── cart.controller.ts
│   └── cart.module.ts
├── order/               # Order management
│   ├── order.entity.ts
│   ├── order-item.entity.ts
│   ├── order.dto.ts
│   ├── order.service.ts
│   ├── order.controller.ts
│   └── order.module.ts
├── wishlist/            # Wishlist functionality
│   ├── wishlist-item.entity.ts
│   ├── wishlist.dto.ts
│   ├── wishlist.service.ts
│   ├── wishlist.controller.ts
│   └── wishlist.module.ts
├── review/              # Review & rating system
│   ├── review.entity.ts
│   ├── review.dto.ts
│   ├── review.service.ts
│   ├── review.controller.ts
│   └── review.module.ts
├── search/              # Advanced search
│   ├── search.dto.ts
│   ├── search.service.ts
│   ├── search.controller.ts
│   └── search.module.ts
├── analytics/           # Analytics & monitoring
│   ├── analytics.entity.ts
│   ├── analytics.service.ts
│   ├── analytics.controller.ts
│   └── analytics.module.ts
├── inventory/           # Inventory management
│   ├── inventory.entity.ts
│   ├── inventory.service.ts
│   ├── inventory.controller.ts
│   └── inventory.module.ts
├── admin/               # Admin panel
│   ├── admin.entity.ts
│   ├── admin.dto.ts
│   ├── admin.service.ts
│   ├── admin.controller.ts
│   └── admin.module.ts
├── health/              # Health monitoring
│   ├── health.controller.ts
│   └── health.module.ts
├── common/              # Shared utilities
│   ├── filters/         # Exception filters
│   │   └── http-exception.filter.ts
│   └── interceptors/    # Response interceptors
│       └── transform.interceptor.ts
├── config/              # Configuration files
│   └── database.config.ts
├── main.ts              # Application entry point
└── app.module.ts        # Root module
```

### Code Style
- Follow NestJS conventions
- Use TypeScript strict mode
- Implement proper error handling with global exception filters
- Add comprehensive validation using DTOs
- Write unit tests for services
- Use TypeORM entities for database modeling
- Implement proper CORS configuration
- Use environment-based configuration
- Follow security best practices
- Implement proper logging and monitoring

## 🚀 Deployment

### Production Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Use strong JWT secret
- [ ] Configure SSL for database
- [ ] Set up proper CORS origins
- [ ] Configure logging
- [ ] Set up monitoring
- [ ] Configure backup strategy
- [ ] Disable database synchronization in production
- [ ] Set up Redis for caching
- [ ] Configure rate limiting
- [ ] Set up health monitoring
- [ ] Configure automated backups

### Docker Deployment
```bash
# Build Docker image
docker build -t bonsaimarket-api .

# Run container
docker run -p 3333:3333 bonsaimarket-api
```

### Environment Setup
```bash
# Production environment variables
NODE_ENV=production
DB_HOST=your-production-db-host
DB_PASSWORD=your-secure-password
JWT_SECRET=your-super-secure-jwt-secret
REDIS_URL=redis://your-redis-host:6379
FRONTEND_URL=https://your-frontend-domain.com
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Email: support@bonsaimarket.com
- Documentation: [API Docs](http://localhost:3333/api/docs)
- Issues: [GitHub Issues](https://github.com/your-repo/issues)

---

**🌳 BonsaiMarket Backend API** - Cultivating digital bonsai experiences since 2024