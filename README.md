# 🌱 Bonsai E-Commerce REST API (NestJS)

A complete RESTful API for managing a bonsai product store, built with [NestJS](https://nestjs.com/), TypeORM, and PostgreSQL.  
Supports Admin & Customer roles, product management, cart, orders, wishlist, and more.

---

## 📁 Project Structure

```
src/
  admin/
    admin.controller.ts
    admin.entity.ts
    admin.module.ts
    admin.service.ts
  auth/
    auth.controller.ts
    auth.module.ts
    auth.service.ts
    dto/
      login.dto.ts
      register.dto.ts
  cart/
    cart.controller.ts
    cart-item.entity.ts
    cart.module.ts
    cart.service.ts
    dto/
      add-to-cart.dto.ts
      update-cart-item.dto.ts
  order/
    order.controller.ts
    order.entity.ts
    order-item.entity.ts
    order.module.ts
    order.service.ts
    dto/
      place-order.dto.ts
      update-order-status.dto.ts
  product/
    product.controller.ts
    product.entity.ts
    product.module.ts
    product.service.ts
    dto/
      create-product.dto.ts
      update-product.dto.ts
      update-stock.dto.ts
  user/
    user.controller.ts
    user.entity.ts
    user.module.ts
    user.service.ts
    profile.entity.ts
    dto/
      update-profile.dto.ts
  wishlist/
    wishlist.controller.ts
    wishlist-item.entity.ts
    wishlist.module.ts
    wishlist.service.ts
    dto/
      add-to-wishlist.dto.ts
app.module.ts
main.ts
```

---

## 📦 Extra Dependencies Installed

- **@nestjs/typeorm** – TypeORM integration for NestJS
- **typeorm** – ORM for TypeScript/JavaScript
- **pg** – PostgreSQL driver for Node.js
- **class-validator** – Decorators for validating DTOs
- **class-transformer** – Used by class-validator for object transformation
- **@nestjs/swagger** – Swagger/OpenAPI integration for NestJS
- **swagger-ui-express** – Serves Swagger UI in Express apps

Install all dependencies with:
```bash
npm install
```

---

## 🚀 Features

### Admin
- **Product Management:** Add, update, delete products; set availability and stock quantity
- **Order Management:** View and manage customer orders
- **Dashboard:** Monitor inventory and sales performance

### Customer
- **User Account:** Register, login, logout, profile management (update details, change password)
- **Shopping Experience:** 
  - Browse products by category (Indoor Bonsai, Outdoor Bonsai, Tools, Soil)
  - Search and filter by price, category, and availability
  - View detailed product pages (image, description, price, stock)
  - Add/remove products to/from cart and update quantities
  - Checkout and place orders

---

## 🏆 Feature Levels

### Basic
- Product categories & filtering
- Product details page
- User authentication system
- Shopping cart functionality
- Order placement & summary
- Admin dashboard for product & order management

### Intermediate
- Wishlist (save products for later)
- Discount coupons & promo codes
- Customer order history
- Product reviews & ratings
- Email notifications (order confirmation, password reset)
- Stock alerts for admin when items run out

### Advanced
- Payment Gateway Integration (Stripe, PayPal, SSLCommerz)
- Real-time stock updates
- Product recommendation system
- Live chat support (WebSockets)
- Multi-language support (English/Bengali)
- Responsive design for web client
- Analytics dashboard for Admin
- Image optimization & lazy loading
- Dark mode support

---

## 📦 API Endpoints

### Auth
```http
POST   /auth/register        # Register user
POST   /auth/login           # Login user (JWT)
GET    /users/profile        # Get profile
PUT    /users/profile        # Update profile
```

### Products
```http
GET    /products             # Get all products (with filters)
GET    /products/:id         # Get product details
POST   /products             # Add new product (Admin only)
PUT    /products/:id         # Update product (Admin only)
DELETE /products/:id         # Delete product (Admin only)
PATCH  /products/:id/stock   # Update stock & availability
```

### Cart
```http
POST   /cart                 # Add to cart
GET    /cart                 # View cart
PUT    /cart/:itemId         # Update quantity
DELETE /cart/:itemId         # Remove from cart
```

### Orders
```http
POST   /orders               # Place order
GET    /orders/my            # View my orders
GET    /orders               # View all orders (Admin)
PUT    /orders/:id/status    # Update order status (Admin)
```

### Wishlist
```http
POST   /wishlist             # Add product to wishlist
GET    /wishlist             # Get wishlist
DELETE /wishlist/:id         # Remove from wishlist
```

---

## 🛠️ Tech Stack

- **Backend:** NestJS, TypeScript
- **Database:** PostgreSQL, TypeORM
- **Authentication:** JWT
- **Real-time:** WebSockets

---

## 🧩 API Validation & Documentation

- **Validation:** All request DTOs use [`class-validator`](https://github.com/typestack/class-validator) decorators for strong validation (e.g. `@IsEmail()`, `@IsString()`, `@MinLength()`).
- **Global ValidationPipe:** Validation is enforced globally using NestJS's `ValidationPipe` (see `main.ts`). Invalid requests will return clear error messages.
- **API Documentation:** All DTOs and endpoints are documented using [`@nestjs/swagger`](https://docs.nestjs.com/openapi/introduction).
- **Swagger UI:** Interactive API docs are available at [`/api`](http://localhost:3333/api) (default port). You can try out endpoints, see request/response schemas, and view validation rules.

---

## 🗄️ Database Modeling & TypeORM Features

### Entity Relationships Implemented
- **One-to-Many:**
  - `User` ↔ `Order` (a user can have many orders)
  - `User` ↔ `CartItem` (a user can have many cart items)
  - `User` ↔ `WishlistItem` (a user can have many wishlist items)
- **Many-to-Many (via join table):**
  - `Order` ↔ `Product` (an order can have many products, a product can be in many orders) using the `OrderItem` join entity, which also stores quantity.
- **One-to-One:**
  - `User` ↔ `Profile` (each user can have one profile with additional info)

### TypeORM Features Used
- **Entities:** All business objects are modeled as TypeORM entities.
- **Decorators:** Uses `@Entity`, `@Column`, `@PrimaryGeneratedColumn`, `@CreateDateColumn`, `@UpdateDateColumn`, and all relation decorators.
- **CRUD Operations:** All modules use TypeORM repositories for create, read, update, and delete.
- **Find Options:** Services use `find`, `findOneBy`, and can be extended with `relations`, `where`, etc.
- **Relations:** Real-world e-commerce relations are modeled (see above).

### Example: Many-to-Many (Order-Product)
- The `OrderItem` entity links `Order` and `Product` with a `quantity` field.
- You can query all products in an order, or all orders containing a product.

### Example: One-to-One (User-Profile)
- The `Profile` entity links to `User` with a one-to-one relationship.
- You can store extra profile info (e.g., bio) for each user.

---

## 🏁 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Run the app:**
   ```bash
   npm run start:dev
   ```
3. **Open Swagger UI:**
   Visit [http://localhost:3333/api](http://localhost:3333/api) in your browser.

---

## 📝 Notes
- All endpoints expect and return JSON.
- Use the Swagger UI to explore the API and see required/optional fields for each request.
- Validation errors will be returned with helpful messages if your request is invalid.
- Database schema is auto-synced in development (see `synchronize: true` in `app.module.ts`).
- Entity relationships are modeled using TypeORM decorators for robust, real-world data modeling.

---