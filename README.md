# 🌳 BonsaiMarket Backend API

A comprehensive NestJS backend API for the BonsaiMarket e-commerce platform, specializing in bonsai trees, tools, and accessories.

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **User Management**: Complete user registration, login, and profile management
- **Product Management**: CRUD operations for bonsai products with categories
- **Shopping Cart**: Add, remove, and manage cart items
- **Wishlist**: Save and manage favorite products
- **Order Management**: Complete order processing and tracking
- **Admin Panel**: Comprehensive admin interface for managing the platform
- **Data Validation**: Comprehensive input validation using class-validator
- **Error Handling**: Global exception handling with consistent error responses
- **CORS Support**: Cross-origin resource sharing for frontend integration
- **Environment Configuration**: Flexible configuration management

## 🛠️ Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT with Passport.js
- **Validation**: class-validator & class-transformer
- **Password Hashing**: bcrypt
- **Environment**: ConfigModule for environment variables

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
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
   PORT=3001
   FRONTEND_URL=http://localhost:3000
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

### Admin Endpoints

- `GET /api/admin/users` - Get all users (admin only)
- `GET /api/admin/orders` - Get all orders (admin only)
- `GET /api/admin/stats` - Get platform statistics (admin only)

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
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

### Products Table
- `id` (Primary Key)
- `name` (String)
- `category` (String)
- `price` (Decimal)
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

## 🧪 Testing

```bash
# Unit tests
npm run test

# e2e tests
npm run test:e2e

# Test coverage
npm run test:cov
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
| `PORT` | Application port | 3001 |
| `NODE_ENV` | Environment | development |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:3000 |

## 🔧 Development

### Project Structure
```
src/
├── auth/                 # Authentication module
│   ├── dto/             # Data transfer objects
│   ├── guards/          # Authentication guards
│   ├── strategies/      # Passport strategies
│   └── ...
├── user/                # User management
├── product/             # Product management
├── cart/                # Shopping cart
├── order/               # Order management
├── wishlist/            # Wishlist functionality
├── admin/               # Admin panel
├── common/              # Shared utilities
│   ├── filters/         # Exception filters
│   ├── interceptors/    # Response interceptors
│   └── ...
└── config/              # Configuration files
```

### Code Style
- Follow NestJS conventions
- Use TypeScript strict mode
- Implement proper error handling
- Add comprehensive validation
- Write unit tests for services
- Use DTOs for data transfer

## 🚀 Deployment

### Production Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Use strong JWT secret
- [ ] Configure SSL for database
- [ ] Set up proper CORS origins
- [ ] Configure logging
- [ ] Set up monitoring
- [ ] Configure backup strategy

### Docker Deployment
```bash
# Build Docker image
docker build -t bonsaimarket-api .

# Run container
docker run -p 3001:3001 bonsaimarket-api
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
- Documentation: [API Docs](http://localhost:3001/api/docs)
- Issues: [GitHub Issues](https://github.com/your-repo/issues)

---

**🌳 BonsaiMarket Backend API** - Cultivating digital bonsai experiences since 2024