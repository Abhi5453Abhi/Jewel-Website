# Database Setup Instructions

## 1. Environment Variables

Make sure you have a `.env.local` file in the root directory with your Neon DB connection string:

```env
DATABASE_URL=postgresql://username:password@hostname/database?sslmode=require
```

## 2. Database Schema Setup

Run the SQL schema file to create the necessary tables. You can do this in one of two ways:

### Option A: Using Neon Console
1. Go to your Neon project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `src/lib/db-schema.sql`
4. Execute the SQL

### Option B: Using psql or a database client
```bash
psql $DATABASE_URL -f src/lib/db-schema.sql
```

## 3. Database Schema

The schema includes:
- **products** - Product inventory and information
- **customers** - Customer information
- **orders** - Order records with relationships to products and customers

## 4. Image Storage

Images are stored as URLs in the database (`image_url` field in products table). The frontend uses localStorage caching to improve performance:

- External image URLs are cached as base64 data URLs
- Cache expires after 7 days
- Maximum cache size: 50MB
- Local paths (starting with `/`) are not cached

## 5. API Endpoints

- `GET /api/products` - List all products (with optional search/category filters)
- `POST /api/products` - Create a new product
- `GET /api/products/[id]` - Get a single product
- `PUT /api/products/[id]` - Update a product
- `DELETE /api/products/[id]` - Delete a product
- `GET /api/orders` - List all orders (with optional search/status filters)
- `POST /api/orders` - Create a new order
- `GET /api/customers` - List all customers (with optional search)
- `POST /api/customers` - Create a new customer
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/recent-orders` - Get recent orders

## 6. Testing the Connection

After setting up the database, you can test the connection by:
1. Starting the development server: `npm run dev`
2. Navigating to `/admin` in your browser
3. The dashboard should load data from the database

If you see errors, check:
- Your `DATABASE_URL` is correct
- The database schema has been created
- Your Neon project is active and accessible

