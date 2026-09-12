# AI-BUSINESS-PROJECT
<img width="1299" height="616" alt="image" src="https://github.com/user-attachments/assets/add61d27-4a6a-435d-8816-4e17c31d4ed0" />

Marketplace application with separate frontend and backend folders.

---

## AI Shopping Assistant

The app includes an intelligent chat assistant powered by **LangChain** and **LangGraph**, with real-time access to the marketplace database.

### How it works

The assistant uses a **LangGraph ReAct agent** that reasons over user messages and decides which tools to call. Tools query MongoDB directly, so results are always live.

| Tool | Triggered when user asks... |
|---|---|
| `search_products` | "find me a lamp", "show apparel under $50" |
| `search_shops` | "what shops are available?", "find a shop in Dar es Salaam" |
| `list_categories` | "what categories do you have?" |
| `get_featured_products` | "what's new?", "show me what's available" |

### Stack

- `@langchain/core` — tool definitions and message types
- `@langchain/openai` — GPT-4o-mini as the reasoning model
- `@langchain/langgraph` — ReAct agent loop (reason → act → observe)

### API Endpoint

#### `POST /api/ai/chat`
Send a conversation to the AI agent. Public endpoint.

**Request Body:**
```json
{
  "messages": [
    { "role": "user", "content": "Show me products under $30" }
  ]
}
```

**Response `200`:**
```json
{ "reply": "Here are some products under $30: ..." }
```

---

## Backend API Documentation

**Base URL:** `http://localhost:3000`

All request and response bodies are JSON. Protected routes require a Bearer token in the `Authorization` header:

```
Authorization: Bearer <token>
```

---

## Authentication

### `POST /auth/login`
Login as a user, owner, or admin.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

**Response `200`:**
```json
{
  "token": "<jwt_token>",
  "user": { "id": "", "email": "", "name": "", "role": "customer | owner" }
}
```
> For admin login, the response returns `admin` instead of `user`.

---

### `POST /auth/logout`
Logout the current user.

**Headers:** `Authorization: Bearer <token>`

**Response `200`:**
```json
{ "success": true }
```

---

## System

### `GET /health`
Check if the server is running.

**Response `200`:**
```json
{ "status": "ok" }
```

---

### `GET /database`
Check database connectivity.

**Response `200`:**
```json
{ "status": "connected" }
```

---

## Users

### `POST /api/users`
Register a new user. Public endpoint.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "yourpassword",
  "name": "John Doe",
  "role": "customer | owner | admin"
}
```

**Response `201`:**
```json
{
  "id": "<user_id>",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "customer"
}
```

---

### `GET /api/users/:id`
Get a user by ID. Requires authentication.

**Response `200`:**
```json
{
  "_id": "<user_id>",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "customer",
  "createdAt": "",
  "updatedAt": ""
}
```

---

### `PATCH /api/users/:id`
Update a user's name or email. Requires authentication.

**Request Body:**
```json
{
  "name": "New Name",
  "email": "newemail@example.com"
}
```

**Response `200`:** Updated user object.

---

### `DELETE /api/users/:id`
Delete a user. Requires authentication.

**Response `200`:**
```json
{ "deleted": true }
```

---

## User Profiles

### `GET /api/users/:userId/profile`
Get a user's profile. Requires authentication (self or admin).

**Response `200`:**
```json
{
  "userId": "<user_id>",
  "displayName": "",
  "avatarUrl": "",
  "phone": "",
  "address": "",
  "bio": ""
}
```

---

### `PUT /api/users/:userId/profile`
Create or update a user's profile. Requires authentication (self or admin).

**Request Body:**
```json
{
  "displayName": "John",
  "phone": "+255700000000",
  "address": "Dar es Salaam",
  "bio": "Short bio here",
  "avatarUrl": "https://example.com/avatar.jpg"
}
```

**Response `200`:** Updated profile object.

---

### `POST /api/users/:userId/profile/avatar`
Upload a profile avatar image. Requires authentication (self or admin).

**Request Body:**
```json
{
  "image": "<base64_string | data_url | image_url>"
}
```

**Response `200`:** Updated profile object with new `avatarUrl`.

---

## Shops

### `GET /api/shops`
List all shops. Public endpoint. Supports query filters.

**Query Params (optional):** Any shop field (e.g. `?status=active`)

**Response `200`:** Array of shop objects.

---

### `GET /api/shops/:id`
Get a shop by ID. Public endpoint.

**Response `200`:**
```json
{
  "_id": "<shop_id>",
  "name": "My Shop",
  "ownerId": "<user_id>",
  "description": "",
  "email": "",
  "phone": "",
  "address": "",
  "logoUrl": "",
  "status": "active",
  "createdAt": "",
  "updatedAt": ""
}
```

---

### `POST /api/shops`
Create a new shop. Requires owner role.

**Request Body:**
```json
{
  "name": "My Shop",
  "ownerId": "<user_id>",
  "description": "Shop description",
  "email": "shop@example.com",
  "phone": "+255700000000",
  "address": "Dar es Salaam",
  "logoUrl": "https://example.com/logo.png"
}
```

**Response `201`:** Created shop object.

---

### `PATCH /api/shops/:id`
Update a shop. Requires owner role.

**Request Body** (any of):
```json
{
  "name": "",
  "description": "",
  "email": "",
  "phone": "",
  "address": "",
  "logoUrl": "",
  "status": "active | inactive"
}
```

**Response `200`:** Updated shop object.

---

### `DELETE /api/shops/:id`
Delete a shop. Requires owner role.

**Response `200`:**
```json
{ "deleted": true }
```

---

## Shop Profiles

### `GET /api/shops/:shopId/profile`
Get a shop's extended profile. Public endpoint.

**Response `200`:**
```json
{
  "shopId": "<shop_id>",
  "tagline": "",
  "bannerUrl": "",
  "businessHours": {},
  "socialLinks": {},
  "policies": ""
}
```

---

### `PUT /api/shops/:shopId/profile`
Create or update a shop's extended profile. Requires owner role.

**Request Body:**
```json
{
  "tagline": "Best shop in town",
  "bannerUrl": "https://example.com/banner.jpg",
  "businessHours": { "mon-fri": "8am - 6pm" },
  "socialLinks": { "instagram": "https://instagram.com/myshop" },
  "policies": "No refunds after 7 days."
}
```

**Response `200`:** Updated shop profile object.

---

## Products

### `GET /api/products`
List all products. Public endpoint. Supports query filters.

**Query Params (optional):** Any product field (e.g. `?category=electronics`)

**Response `200`:** Array of product objects.

---

### `GET /api/products/:id`
Get a product by ID. Public endpoint.

**Response `200`:**
```json
{
  "_id": "<product_id>",
  "name": "Product Name",
  "description": "",
  "price": 10000,
  "stock": 50,
  "category": "electronics",
  "imageUrl": "",
  "createdAt": "",
  "updatedAt": ""
}
```

---

### `POST /api/products`
Create a new product. Requires admin or owner role.

**Request Body:**
```json
{
  "name": "Product Name",
  "description": "Product description",
  "price": 10000,
  "stock": 50,
  "category": "electronics",
  "imageUrl": "https://example.com/product.jpg",
  "image": "<base64_string | data_url | image_url>"
}
```
> Provide either `imageUrl` or `image` (base64/URL). If `image` is provided, it is uploaded to Cloudinary automatically.

**Response `201`:** Created product object.

---

### `PATCH /api/products/:id`
Update a product. Requires admin or owner role.

**Request Body** (any of):
```json
{
  "name": "",
  "description": "",
  "price": 0,
  "stock": 0,
  "category": "",
  "imageUrl": "",
  "image": "<base64_string | data_url | image_url>"
}
```

**Response `200`:** Updated product object.

---

### `DELETE /api/products/:id`
Delete a product. Requires admin or owner role.

**Response `200`:**
```json
{ "deleted": true }
```

---

## Product Profiles

### `GET /api/products/:productId/profile`
Get a product's extended profile. Public endpoint.

**Response `200`:**
```json
{
  "productId": "<product_id>",
  "specifications": {},
  "tags": [],
  "gallery": [],
  "featured": false
}
```

---

### `PUT /api/products/:productId/profile`
Create or update a product's extended profile. Requires admin role.

**Request Body:**
```json
{
  "specifications": { "weight": "1kg", "color": "black" },
  "tags": ["electronics", "sale"],
  "gallery": ["https://example.com/img1.jpg"],
  "featured": true
}
```

**Response `200`:** Updated product profile object.

---

## Admins

> All admin endpoints require admin role.

### `GET /api/admins`
List all admins.

**Response `200`:** Array of admin user objects (no password fields).

---

### `GET /api/admins/:id`
Get an admin by ID.

**Response `200`:** Admin user object.

---

### `PATCH /api/admins/:id`
Update an admin's name or email.

**Request Body:**
```json
{
  "name": "New Name",
  "email": "newemail@example.com"
}
```

**Response `200`:** Updated admin object.

---

## Owners

> All owner endpoints require owner role.

### `GET /api/owners`
List all owners.

**Response `200`:** Array of owner user objects (no password fields).

---

### `GET /api/owners/:id`
Get an owner by ID.

**Response `200`:** Owner user object.

---

### `PATCH /api/owners/:id`
Update an owner's name or email.

**Request Body:**
```json
{
  "name": "New Name",
  "email": "newemail@example.com"
}
```

**Response `200`:** Updated owner object.

---

## Image Uploads

### `POST /api/uploads/images`
Upload an image to Cloudinary. Requires admin role.

**Request Body:**
```json
{
  "image": "<base64_string | data_url | image_url>",
  "folder": "ai-project/products"
}
```

**Response `201`:**
```json
{
  "publicId": "ai-project/products/abc123",
  "url": "https://res.cloudinary.com/...",
  "width": 800,
  "height": 600,
  "format": "jpg"
}
```

---

## Error Responses

All errors return a JSON body with an `error` field:

```json
{ "error": "Error message here" }
```

| Status | Meaning                        |
|--------|--------------------------------|
| 400    | Bad request / validation error |
| 401    | Unauthorized                   |
| 403    | Forbidden (insufficient role)  |
| 404    | Route not found                |
| 503    | Database unavailable           |

---

## Roles & Permissions

| Role       | Permissions                                              |
|------------|----------------------------------------------------------|
| `customer` | Register, login, manage own profile                      |
| `owner`    | All customer permissions + manage shops & products       |
| `admin`    | Full access to all resources                             |

---

## Owner — Product Management

> All endpoints require owner role. Owners can only edit products they own.

### `PATCH /api/owner/products/:id`
Update an owned product. Emits a `low_stock` socket event if stock falls at or below the threshold after update.

**Request Body** (any of):
```json
{
  "name": "",
  "description": "",
  "price": 0,
  "stock": 0,
  "category": "",
  "imageUrl": "",
  "image": "<base64_string | data_url | image_url>",
  "lowStockThreshold": 10
}
```

**Response `200`:** Updated product object.

---

### `GET /api/owner/products/:id/stock`
Get current stock level and low-stock status for a product.

**Response `200`:**
```json
{
  "productId": "<product_id>",
  "name": "Product Name",
  "stock": 5,
  "lowStockThreshold": 10,
  "isLow": true
}
```

---

### `PATCH /api/owner/products/:id/stock/threshold`
Set the low-stock alert threshold for a product.

**Request Body:**
```json
{ "threshold": 10 }
```

**Response `200`:** Updated product object.

---

## Owner — Dashboard

> All endpoints require owner role.

### `GET /api/owner/customers`
List all registered customers.

**Response `200`:** Array of customer user objects (no password fields).

---

### `GET /api/owner/shops/:shopId/marketing`
Get the marketing profile for a shop.

**Response `200`:**
```json
{
  "shopId": "<shop_id>",
  "headline": "",
  "promoText": "",
  "discountPercent": 0,
  "featuredProductIds": [],
  "campaignBannerUrl": "",
  "campaignEndsAt": ""
}
```

---

### `PUT /api/owner/shops/:shopId/marketing`
Create or update the marketing profile for a shop.

**Request Body:**
```json
{
  "headline": "Summer Sale!",
  "promoText": "Up to 50% off selected items",
  "discountPercent": 20,
  "featuredProductIds": ["<product_id>"],
  "campaignBannerUrl": "https://example.com/banner.jpg",
  "campaignEndsAt": "2025-12-31T23:59:59Z"
}
```

**Response `200`:** Updated marketing object.

---

## Admin — Shop Owners

> All endpoints require admin role.

### `GET /api/admin/shop-owners`
List all shop owners.

**Response `200`:** Array of owner user objects (no password fields).

---

### `GET /api/admin/shop-owners/:id`
Get a shop owner by ID.

**Response `200`:** Owner user object.

---

### `DELETE /api/admin/shop-owners/:id`
Delete a shop owner account.

**Response `200`:**
```json
{ "deleted": true }
```

---

## Admin — All Shops

### `GET /api/admin/shops`
List all shops with their owner details. Requires admin role.

**Response `200`:**
```json
[
  {
    "_id": "<shop_id>",
    "name": "My Shop",
    "ownerId": "<user_id>",
    "status": "active",
    "owner": { "_id": "", "name": "", "email": "" }
  }
]
```

---

## Real-Time — Socket.io

Connect to the server via Socket.io at `http://localhost:3000`.

### Event: `low_stock`
Emitted to all connected clients when a product's stock is at or below its `lowStockThreshold` after an update.

**Payload:**
```json
{
  "productId": "<product_id>",
  "name": "Product Name",
  "stock": 3,
  "threshold": 10
}
```

**Frontend example:**
```js
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');
socket.on('low_stock', (data) => {
  console.warn(`Low stock alert: ${data.name} has only ${data.stock} left`);
});
```
