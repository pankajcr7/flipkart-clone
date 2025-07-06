# Admin Products Setup Guide

## Overview

This application has been updated to remove mock products and replace them with a complete admin product management system. All products displayed on the website are now managed through the admin dashboard and stored in the database.

## What Was Changed

1. **Removed External API Dependencies**: 
   - Deleted `fetch_products.js` (external API product fetching)
   - Deleted `frontend/src/hooks/useProducts.js` (external API hook)

2. **Removed Mock Product Data**:
   - Cleaned up `frontend/src/utils/constants.js` to remove `offerProducts` and `topBrandsProducts` arrays
   - Updated categories to match the seed data

3. **Updated Components**:
   - `DealSlider` component now uses admin products from Redux store instead of mock data
   - All product displays now use the admin product API endpoints

4. **Added Database Seeding**:
   - Created `backend/data/seedProducts.js` with sample admin products
   - Added npm script `seed-products` to populate the database

## How to Setup Admin Products

### 1. Environment Setup

Make sure you have your environment variables configured in `backend/config/config.env`:

```env
PORT=4000
DB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
COOKIE_EXPIRE=7

# Cloudinary for image uploads
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_secret

# Email service (optional)
SENDGRID_API_KEY=your_sendgrid_api_key
```

### 2. Install Dependencies and Seed Database

```bash
# Install dependencies
npm install

# Seed the database with sample admin products
npm run seed-products

# Start the development server
npm run dev
```

### 3. Access Admin Panel

1. Start the application: `npm run dev`
2. Register/Login as a user
3. You'll need to manually set a user as admin in the database:
   ```javascript
   // In MongoDB, update a user to admin role
   db.users.updateOne(
     {email: "your_email@example.com"}, 
     {$set: {role: "admin"}}
   )
   ```
4. Access admin panel at: `http://localhost:3000/admin/dashboard`

### 4. Managing Products

**Through Admin Dashboard:**
- **View Products**: `/admin/products` - See all products in a data table
- **Add Product**: `/admin/new_product` - Create new products with images, specifications, etc.
- **Edit Product**: Click edit button on any product in the products table
- **Delete Product**: Click delete button on any product

**Product Fields:**
- Name, Description, Price, Cutted Price
- Category (Electronics, Mobiles, Laptops, Fashion, TVs & Appliances)
- Stock, Warranty, Brand Name & Logo
- Product Images (multiple)
- Highlights (key features)
- Specifications (detailed specs)

## Seeded Product Categories

The seed script includes products in these categories:
- **Mobiles**: iPhone 14 Pro Max, Samsung Galaxy S23 Ultra
- **Laptops**: MacBook Pro 14-inch M3 Pro
- **Electronics**: Sony WH-1000XM5 Headphones
- **TVs & Appliances**: LG 55" 4K OLED TV
- **Fashion**: Nike Air Max 270 React

## API Endpoints

### Public Endpoints:
- `GET /api/v1/products` - Get products with filtering/pagination
- `GET /api/v1/products/all` - Get all products (used by sliders)
- `GET /api/v1/product/:id` - Get single product details

### Admin Endpoints:
- `GET /api/v1/admin/products` - Get all products for admin
- `POST /api/v1/admin/product/new` - Create new product
- `PUT /api/v1/admin/product/:id` - Update product
- `DELETE /api/v1/admin/product/:id` - Delete product

## Frontend Data Flow

1. **Home Page**: Uses `getSliderProducts()` action to fetch all products
2. **Product Sliders**: Randomly display admin products in different sections
3. **Products Page**: Uses `getProducts()` with filtering/search
4. **Admin Pages**: Use `getAdminProducts()` for management interface

## Notes

- All images are uploaded to Cloudinary for optimal performance
- Products include full e-commerce features: reviews, ratings, stock management
- The system supports multiple product images and detailed specifications
- Categories can be extended by updating the `categories` array in `frontend/src/utils/constants.js`

## Troubleshooting

**No products showing?**
1. Make sure MongoDB is connected
2. Run the seed script: `npm run seed-products`
3. Check that Cloudinary credentials are correct

**Admin access issues?**
1. Ensure user role is set to "admin" in database
2. Check JWT token is valid
3. Verify admin routes are protected properly

**Image upload problems?**
1. Verify Cloudinary configuration
2. Check file size limits
3. Ensure network connectivity to Cloudinary
