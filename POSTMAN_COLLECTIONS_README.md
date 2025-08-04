# 🚀 GreenGuest API Postman Collections

This directory contains comprehensive Postman collections for testing the GreenGuest API endpoints. All collections have been updated to work with the latest backend structure.

## 📁 Collections Overview

### 1. **Authentication Collection** (`postman_auth_collection.json`)
- **Purpose**: Handle user authentication and authorization
- **Key Endpoints**: Register, Login, Profile, Refresh Token, Logout
- **Authentication**: JWT Bearer tokens

### 2. **User Management Collection** (`postman_user_collection.json`)
- **Purpose**: Complete user CRUD operations
- **Key Endpoints**: Create, Read, Update, Delete users and profiles
- **Features**: Validation testing, error handling

### 3. **Product Management Collection** (`postman_product_collection.json`)
- **Purpose**: Product catalog and inventory management
- **Key Endpoints**: Product CRUD, stock management, availability toggle
- **Features**: Category queries, brand filtering, validation testing

### 4. **Cart Management Collection** (`postman_cart_collection.json`)
- **Purpose**: Shopping cart operations
- **Key Endpoints**: Add/Remove items, update quantities, clear cart
- **Features**: User-specific cart management

### 5. **Wishlist Collection** (`postman_wishlist_collection.json`)
- **Purpose**: User wishlist functionality
- **Key Endpoints**: Add/Remove from wishlist, check items
- **Features**: User-specific wishlist management

### 6. **Admin Management Collection** (`postman_admin_collection.json`)
- **Purpose**: Administrative operations
- **Key Endpoints**: Admin CRUD, role management, system administration
- **Features**: Comprehensive admin testing

## 🔧 Setup Instructions

### 1. **Import Collections**
1. Open Postman
2. Click "Import" button
3. Select all JSON files from this directory
4. Collections will be imported with proper structure

### 2. **Environment Setup**
Create a new environment with these variables:
```
baseUrl: http://localhost:3333/api
authToken: (leave empty - will be set after login)
refreshToken: (leave empty - will be set after login)
```

### 3. **Backend Requirements**
Ensure your backend is running:
```bash
# Start the backend server
npm run start:dev
# Server should be running on http://localhost:3333
```

## 🚀 Quick Start Guide

### Step 1: Authentication
1. **Register a User**: Use `postman_auth_collection.json` → "User Registration"
2. **Login**: Use "User Login" to get authentication tokens
3. **Set Tokens**: Copy the response tokens to environment variables

### Step 2: Test Core Features
1. **Products**: Use `postman_product_collection.json` to create and manage products
2. **Cart**: Use `postman_cart_collection.json` to test shopping cart functionality
3. **Wishlist**: Use `postman_wishlist_collection.json` to test wishlist features

### Step 3: Admin Operations
1. **Admin Setup**: Use `postman_admin_collection.json` for administrative tasks
2. **User Management**: Use `postman_user_collection.json` for user operations

## 📋 API Structure

### Base URL
```
http://localhost:3333/api
```

### Authentication
- **JWT Bearer Token**: Required for protected endpoints
- **Token Format**: `Bearer <your-jwt-token>`
- **Header**: `Authorization: Bearer <token>`

### Response Format
All API responses follow this structure:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🔍 Testing Strategy

### 1. **Happy Path Testing**
- Test all endpoints with valid data
- Verify successful responses
- Check data integrity

### 2. **Validation Testing**
- Test with invalid data (missing fields, wrong formats)
- Verify proper error messages
- Check validation rules

### 3. **Error Handling**
- Test with non-existent resources (404 errors)
- Test unauthorized access (401 errors)
- Test forbidden operations (403 errors)

### 4. **Authentication Testing**
- Test protected endpoints without tokens
- Test with expired tokens
- Test token refresh functionality

## 📝 Key Features

### ✅ **Updated Structure**
- All endpoints use `/api/` prefix
- Consistent URL structure across collections
- Proper HTTP methods and status codes

### ✅ **User Entity Compatibility**
- Updated to use `firstName` and `lastName` instead of `name`
- Proper phone number validation
- Password confirmation support

### ✅ **Authentication Integration**
- JWT token support
- Protected endpoint testing
- Token refresh functionality

### ✅ **Comprehensive Testing**
- CRUD operations for all entities
- Validation and error testing
- Admin and user role testing

## 🛠️ Troubleshooting

### Common Issues

1. **Connection Refused**
   - Ensure backend is running on port 3333
   - Check if database is connected

2. **Authentication Errors**
   - Verify JWT token is valid
   - Check token expiration
   - Ensure proper Authorization header format

3. **Validation Errors**
   - Check required fields in request body
   - Verify data format (email, phone, etc.)
   - Ensure password meets requirements

4. **404 Errors**
   - Verify endpoint URLs are correct
   - Check if resources exist in database
   - Ensure proper HTTP methods

### Debug Tips

1. **Check Response Headers**: Look for CORS and authentication headers
2. **Verify Request Body**: Ensure JSON format is correct
3. **Test with Postman Console**: Enable console for detailed logging
4. **Check Backend Logs**: Monitor server console for errors

## 📚 Additional Resources

- **Backend Documentation**: See `README.md` in backend directory
- **API Documentation**: Check backend source code for detailed endpoint documentation
- **Database Schema**: Review entity files for data structure

## 🔄 Collection Updates

These collections are regularly updated to match the latest backend changes:

- ✅ **API Prefix**: Updated to use `/api/` prefix
- ✅ **User Entity**: Updated to use `firstName`/`lastName` structure
- ✅ **Authentication**: Added proper JWT authentication
- ✅ **Validation**: Updated to match backend validation rules
- ✅ **Error Handling**: Improved error response testing

---

**Happy Testing! 🎉**

For support or questions, refer to the main project documentation or backend README. 