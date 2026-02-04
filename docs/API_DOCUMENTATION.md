# API Documentation

## Base URL
```
http://localhost:5000/api/v1
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Authentication Endpoints

### Register User
```http
POST /auth/register
```

**Request Body:**
```json
{
  "email": "customer@example.com",
  "phoneNumber": "+919876543210",
  "password": "securepassword",
  "fullName": "John Doe",
  "userType": "customer",
  "preferredLanguage": "en"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid",
      "email": "customer@example.com",
      "phoneNumber": "+919876543210",
      "fullName": "John Doe",
      "userType": "customer",
      "preferredLanguage": "en"
    },
    "token": "jwt_token_here"
  }
}
```

### Login
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "customer@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "email": "customer@example.com",
      "userType": "customer",
      "preferredLanguage": "en"
    },
    "token": "jwt_token_here"
  }
}
```

---

## Products Endpoints

### Get All Products
```http
GET /products?category=kurta&page=1&limit=20
```

**Query Parameters:**
- `category` (optional): Filter by category (kurta, saree, salwar, etc.)
- `minPrice` (optional): Minimum price
- `maxPrice` (optional): Maximum price
- `search` (optional): Search term
- `featured` (optional): Filter featured products (true/false)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

**Response:**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "uuid",
        "name_en": "Cotton Kurta",
        "name_te": "కాటన్ కుర్తా",
        "description_en": "Comfortable cotton kurta",
        "price": 599.00,
        "images": ["url1", "url2"],
        "category": "kurta",
        "average_rating": 4.5,
        "variants": [
          {"id": "uuid", "size": "M", "stock_available": 10}
        ]
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5
    }
  }
}
```

### Get Product by ID
```http
GET /products/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name_en": "Cotton Kurta",
    "price": 599.00,
    "seller_name": "ABC Textiles",
    "seller_phone": "+919876543210",
    "variants": [
      {"id": "uuid", "size": "M", "stock_available": 10},
      {"id": "uuid", "size": "L", "stock_available": 5}
    ]
  }
}
```

### Get Size Recommendation
```http
GET /products/:id/size-recommendation?height=170&weight=65&bodyType=average&fitPreference=regular
```

**Query Parameters:**
- `height` (optional): Height in cm
- `weight` (optional): Weight in kg
- `chest` (optional): Chest measurement in cm
- `waist` (optional): Waist measurement in cm
- `bodyType` (optional): slim, average, curvy, athletic
- `fitPreference` (optional): tight, regular, loose

**Response:**
```json
{
  "success": true,
  "data": {
    "recommendedSize": "M",
    "confidence": 0.85,
    "message": "Based on your measurements, we recommend size M",
    "alternativeSizes": ["M", "L"]
  }
}
```

---

## Orders Endpoints

### Create Order
```http
POST /orders
```
*Requires authentication*

**Request Body:**
```json
{
  "variantId": "uuid",
  "quantity": 1,
  "deliveryAddressId": "uuid",
  "paymentMethod": "upi"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "id": "uuid",
    "order_number": "HYD1234567890ABCD",
    "total_amount": 649.00,
    "status": "pending",
    "payment_status": "pending"
  }
}
```

### Get My Orders
```http
GET /orders?status=pending&page=1
```
*Requires authentication*

**Response:**
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": "uuid",
        "order_number": "HYD1234567890ABCD",
        "product_name": "Cotton Kurta",
        "total_amount": 649.00,
        "status": "shipped",
        "created_at": "2026-01-01T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 5,
      "totalPages": 1
    }
  }
}
```

### Cancel Order
```http
PATCH /orders/:id/cancel
```
*Requires authentication*

**Request Body:**
```json
{
  "reason": "Changed my mind"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order cancelled successfully"
}
```

---

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": {} // Optional validation errors
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `500` - Internal Server Error
- `501` - Not Implemented

---

## Rate Limiting

- 100 requests per 15 minutes per IP address
- Exceeding this limit returns HTTP 429 (Too Many Requests)

---

## Webhooks

### Razorpay Payment Webhook
```http
POST /webhooks/razorpay
```

### Shiprocket Logistics Webhook
```http
POST /webhooks/shiprocket
```

### Twilio WhatsApp Webhook
```http
POST /webhooks/twilio
```
