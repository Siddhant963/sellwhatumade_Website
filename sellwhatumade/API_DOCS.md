# SellWhatUMade — API Requirements Document

> All endpoints are prefixed with `/api/v1`. Auth-protected routes require a Bearer token in the `Authorization` header. Seller-only and Admin-only routes are marked explicitly.

---

## Table of Contents

1. [Authentication](#1-authentication)
2. [Products](#2-products)
3. [Categories](#3-categories)
4. [Artisans](#4-artisans)
5. [Cart](#5-cart)
6. [Wishlist](#6-wishlist)
7. [Checkout & Payments](#7-checkout--payments)
8. [Orders (Buyer)](#8-orders-buyer)
9. [Returns](#9-returns)
10. [Notifications](#10-notifications)
11. [Messages](#11-messages)
12. [User Settings](#12-user-settings)
13. [Seller — Onboarding](#13-seller--onboarding)
14. [Seller — Products / Inventory](#14-seller--products--inventory)
15. [Seller — Orders](#15-seller--orders)
16. [Seller — Payouts](#16-seller--payouts)
17. [Seller — Analytics](#17-seller--analytics)
18. [Admin — Dashboard](#18-admin--dashboard)
19. [Admin — Users](#19-admin--users)
20. [Admin — Orders](#20-admin--orders)

---

## 1. Authentication

### POST `/api/v1/auth/signup`

Register a new buyer or seller.

**Input**
```json
{
  "fullName": "Priya Sharma",
  "email": "priya@example.com",
  "phone": "9876543210",
  "password": "Min8CharsMixed!",
  "role": "buyer | seller",
  "craftCategory": "Textiles & Weaving"   // required only when role = seller
}
```

**Output**
```json
{
  "userId": "usr_abc123",
  "fullName": "Priya Sharma",
  "email": "priya@example.com",
  "role": "buyer",
  "token": "eyJhbGci...",
  "expiresAt": "2026-07-09T10:00:00Z"
}
```

---

### POST `/api/v1/auth/login`

Authenticate an existing user.

**Input**
```json
{
  "email": "priya@example.com",
  "password": "Min8CharsMixed!"
}
```

**Output**
```json
{
  "userId": "usr_abc123",
  "fullName": "Priya Sharma",
  "email": "priya@example.com",
  "role": "buyer | seller | admin",
  "token": "eyJhbGci...",
  "expiresAt": "2026-07-09T10:00:00Z"
}
```

---

### POST `/api/v1/auth/google`

OAuth login/signup via Google.

**Input**
```json
{
  "idToken": "<Google OAuth ID token>",
  "role": "buyer | seller"               // only needed on first sign-up
}
```

**Output** — same as `/auth/login`

---

### POST `/api/v1/auth/forgot-password`

Send a password reset email.

**Input**
```json
{
  "email": "priya@example.com"
}
```

**Output**
```json
{
  "message": "Reset link sent if account exists."
}
```

---

### POST `/api/v1/auth/reset-password`

Reset password using the token from the email link.

**Input**
```json
{
  "token": "<reset-token-from-email>",
  "newPassword": "NewSecurePass1!"
}
```

**Output**
```json
{
  "message": "Password updated successfully."
}
```

---

### POST `/api/v1/auth/logout`

Invalidate the current session token.

**Input** — none (token from header)

**Output**
```json
{
  "message": "Logged out."
}
```

---

### GET `/api/v1/auth/me`

Get the currently authenticated user's profile.

**Output**
```json
{
  "userId": "usr_abc123",
  "fullName": "Priya Sharma",
  "email": "priya@example.com",
  "phone": "9876543210",
  "role": "buyer",
  "avatar": "https://cdn.swum.in/avatars/usr_abc123.jpg",
  "location": "Mumbai, MH",
  "language": "en",
  "currency": "INR",
  "createdAt": "2025-01-15T08:00:00Z"
}
```

---

## 2. Products

### GET `/api/v1/products`

Fetch paginated product listings with optional filters.

**Query Parameters**
| Param | Type | Description |
|---|---|---|
| `search` | string | Full-text search on name |
| `category` | string | Category slug (e.g. `textiles`) |
| `minPrice` | number | Minimum price in ₹ |
| `maxPrice` | number | Maximum price in ₹ |
| `material` | string | e.g. `Pashmina`, `Brass` |
| `region` | string | e.g. `Rajasthan`, `Kashmir` |
| `isFeatured` | boolean | Filter featured products |
| `isNew` | boolean | Filter newly listed |
| `sort` | string | `popularity`, `price_asc`, `price_desc`, `rating`, `newest` |
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 20) |

**Output**
```json
{
  "products": [
    {
      "id": "1",
      "name": "Hand-Painted Blue Pottery Vase",
      "price": 3450,
      "originalPrice": 4200,
      "rating": 4.9,
      "reviewCount": 48,
      "artisanId": "a1",
      "artisan": "Laxman Singh",
      "artisanLocation": "Jaipur, Rajasthan",
      "category": "Pottery",
      "categorySlug": "pottery",
      "material": "Quartz & Glass Powder",
      "region": "Rajasthan",
      "image": "https://cdn.swum.in/products/1/main.jpg",
      "images": ["https://cdn...", "https://cdn..."],
      "badge": "Verified Artisan",
      "isNew": false,
      "isFeatured": true,
      "stock": 3,
      "description": "A masterpiece from the ancient blue pottery tradition..."
    }
  ],
  "pagination": {
    "total": 248,
    "page": 1,
    "limit": 20,
    "totalPages": 13
  }
}
```

---

### GET `/api/v1/products/:id`

Fetch a single product's full details including related products.

**Output**
```json
{
  "id": "1",
  "name": "Hand-Painted Blue Pottery Vase",
  "price": 3450,
  "originalPrice": 4200,
  "rating": 4.9,
  "reviewCount": 48,
  "artisanId": "a1",
  "artisan": "Laxman Singh",
  "artisanLocation": "Jaipur, Rajasthan",
  "artisanAvatar": "https://cdn.swum.in/artisans/a1/avatar.jpg",
  "artisanCertified": true,
  "category": "Pottery",
  "categorySlug": "pottery",
  "material": "Quartz & Glass Powder",
  "technique": "Hand-painting with mineral pigments",
  "region": "Rajasthan",
  "timeToProduce": "3–5 days",
  "image": "https://cdn.swum.in/products/1/main.jpg",
  "images": ["https://cdn...", "https://cdn...", "https://cdn..."],
  "badge": "Verified Artisan",
  "isNew": false,
  "isFeatured": true,
  "stock": 3,
  "sku": "POT-BPV-001",
  "description": "A masterpiece from the ancient blue pottery tradition...",
  "tags": ["pottery", "blue-pottery", "jaipur", "home-decor"],
  "reviews": [
    {
      "id": "r1",
      "userId": "usr_xyz",
      "userName": "Ananya P.",
      "userLocation": "Mumbai",
      "rating": 5,
      "text": "Absolutely beautiful craftsmanship!",
      "createdAt": "2026-03-10T12:00:00Z",
      "verified": true
    }
  ],
  "relatedProducts": [
    { "id": "3", "name": "...", "price": 2100, "image": "...", "rating": 4.8 }
  ]
}
```

---

## 3. Categories

### GET `/api/v1/categories`

Fetch all product categories.

**Output**
```json
{
  "categories": [
    {
      "id": "textiles",
      "name": "Hand-woven Textiles",
      "count": 120,
      "image": "https://cdn.swum.in/categories/textiles.jpg"
    },
    {
      "id": "pottery",
      "name": "Terracotta & Pottery",
      "count": 85,
      "image": "https://cdn.swum.in/categories/pottery.jpg"
    }
  ]
}
```

---

## 4. Artisans

### GET `/api/v1/artisans`

Fetch paginated artisan directory listing.

**Query Parameters**
| Param | Type | Description |
|---|---|---|
| `search` | string | Search by name or craft |
| `craft` | string | Filter by craft type |
| `location` | string | Filter by state/region |
| `certified` | boolean | Only verified artisans |
| `sort` | string | `rating`, `products`, `newest` |
| `page` | number | Default: 1 |
| `limit` | number | Default: 12 |

**Output**
```json
{
  "artisans": [
    {
      "id": "1",
      "name": "Kamala Devi",
      "craft": "Indigo Weaver",
      "location": "Varanasi, UP",
      "avatar": "https://cdn.swum.in/artisans/1/avatar.jpg",
      "story": "After my husband fell ill, weaving became my lifeline...",
      "productCount": 14,
      "rating": 4.9,
      "certified": true,
      "yearsActive": 12
    }
  ],
  "pagination": {
    "total": 1240,
    "page": 1,
    "limit": 12,
    "totalPages": 104
  }
}
```

---

### GET `/api/v1/artisans/:id`

Fetch a single artisan's public storefront.

**Output**
```json
{
  "id": "1",
  "name": "Kamala Devi",
  "craft": "Indigo Weaver",
  "location": "Varanasi, UP",
  "avatar": "https://cdn.swum.in/artisans/1/avatar.jpg",
  "coverImage": "https://cdn.swum.in/artisans/1/cover.jpg",
  "story": "After my husband fell ill...",
  "bio": "Full artisan biography text...",
  "certified": true,
  "yearsActive": 12,
  "stats": {
    "productCount": 14,
    "totalSales": 342,
    "repeatBuyerPercent": 64,
    "avgRating": 4.9
  },
  "products": [
    {
      "id": "2",
      "name": "Banarasi Silk Stole",
      "price": 5800,
      "image": "https://cdn.swum.in/products/2/main.jpg",
      "category": "Textiles",
      "rating": 5.0,
      "stock": 7
    }
  ],
  "reviews": [
    {
      "id": "r5",
      "userName": "Rohan M.",
      "userLocation": "Bangalore",
      "rating": 5,
      "text": "Stunning quality...",
      "createdAt": "2026-04-02T09:30:00Z"
    }
  ]
}
```

---

## 5. Cart

> All cart endpoints require authentication.

### GET `/api/v1/cart`

Fetch the current user's cart.

**Output**
```json
{
  "cartId": "cart_abc123",
  "items": [
    {
      "cartItemId": "ci_001",
      "productId": "1",
      "name": "Hand-Painted Blue Pottery Vase",
      "artisan": "Laxman Singh",
      "artisanLocation": "Jaipur, Rajasthan",
      "image": "https://cdn.swum.in/products/1/main.jpg",
      "price": 3450,
      "originalPrice": 4200,
      "quantity": 1,
      "stock": 3,
      "maxQuantity": 3
    }
  ],
  "coupon": {
    "code": "CRAFT10",
    "discount": 450,
    "type": "flat"
  },
  "summary": {
    "subtotal": 12250,
    "discount": 450,
    "shipping": 0,
    "total": 11800
  }
}
```

---

### POST `/api/v1/cart/items`

Add a product to the cart.

**Input**
```json
{
  "productId": "1",
  "quantity": 1
}
```

**Output**
```json
{
  "cartItemId": "ci_001",
  "productId": "1",
  "quantity": 1,
  "cartTotal": 3450
}
```

---

### PUT `/api/v1/cart/items/:cartItemId`

Update quantity of a cart item.

**Input**
```json
{
  "quantity": 2
}
```

**Output**
```json
{
  "cartItemId": "ci_001",
  "quantity": 2,
  "cartTotal": 6900
}
```

---

### DELETE `/api/v1/cart/items/:cartItemId`

Remove an item from the cart.

**Output**
```json
{
  "message": "Item removed.",
  "cartTotal": 8800
}
```

---

### POST `/api/v1/cart/coupon`

Apply a coupon code to the cart.

**Input**
```json
{
  "code": "CRAFT10"
}
```

**Output**
```json
{
  "code": "CRAFT10",
  "discount": 450,
  "type": "flat | percent",
  "message": "Coupon applied! You save ₹450."
}
```

Error (invalid code):
```json
{
  "error": "INVALID_COUPON",
  "message": "This coupon code is invalid or expired."
}
```

---

### DELETE `/api/v1/cart/coupon`

Remove the applied coupon.

**Output**
```json
{
  "message": "Coupon removed."
}
```

---

## 6. Wishlist

> All wishlist endpoints require authentication.

### GET `/api/v1/wishlist`

Fetch the user's wishlist.

**Query Parameters**
| Param | Type | Description |
|---|---|---|
| `availableOnly` | boolean | Filter out-of-stock items |
| `sort` | string | `recent`, `price_asc`, `price_desc`, `rating` |

**Output**
```json
{
  "items": [
    {
      "wishlistItemId": "wi_001",
      "productId": "7",
      "name": "Pashmina Shawl – Natural Ivory",
      "artisan": "Farida Khatun",
      "artisanLocation": "Srinagar, J&K",
      "artisanCertified": true,
      "image": "https://cdn.swum.in/products/7/main.jpg",
      "price": 12500,
      "originalPrice": 15000,
      "rating": 4.9,
      "reviewCount": 54,
      "stock": 4,
      "addedAt": "2026-05-20T14:00:00Z"
    }
  ],
  "totalCount": 4
}
```

---

### POST `/api/v1/wishlist`

Add a product to the wishlist.

**Input**
```json
{
  "productId": "7"
}
```

**Output**
```json
{
  "wishlistItemId": "wi_001",
  "productId": "7",
  "message": "Added to wishlist."
}
```

---

### DELETE `/api/v1/wishlist/:productId`

Remove a product from the wishlist.

**Output**
```json
{
  "message": "Removed from wishlist."
}
```

---

## 7. Checkout & Payments

### POST `/api/v1/checkout/validate-address`

Validate a shipping address before payment.

**Input**
```json
{
  "firstName": "Priya",
  "lastName": "Deshmukh",
  "email": "priya@example.com",
  "phone": "9876543210",
  "address": "12 Green Park, Andheri West",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pinCode": "400053"
}
```

**Output**
```json
{
  "valid": true,
  "deliveryEstimate": "3–5 business days",
  "shippingCharge": 0
}
```

---

### POST `/api/v1/checkout/create-order`

Place the order (call after payment is verified).

**Input**
```json
{
  "shippingAddress": {
    "firstName": "Priya",
    "lastName": "Deshmukh",
    "email": "priya@example.com",
    "phone": "9876543210",
    "address": "12 Green Park, Andheri West",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pinCode": "400053"
  },
  "paymentMethod": "card | upi",
  "paymentReference": "pay_xyz9876",
  "cartId": "cart_abc123"
}
```

**Output**
```json
{
  "orderId": "#SW-20261",
  "total": 11800,
  "estimatedDelivery": "June 14–16, 2026",
  "artisansSupported": 2,
  "items": [
    {
      "productId": "1",
      "name": "Hand-Painted Blue Pottery Vase",
      "quantity": 1,
      "price": 3450
    }
  ]
}
```

---

### POST `/api/v1/checkout/payment/initiate`

Initiate a payment session (returns a payment gateway token or order).

**Input**
```json
{
  "amount": 11800,
  "currency": "INR",
  "method": "card | upi",
  "cartId": "cart_abc123"
}
```

**Output**
```json
{
  "paymentSessionId": "pay_sess_xyz",
  "gatewayOrderId": "order_razorpay_abc",
  "amount": 11800,
  "currency": "INR",
  "expiresAt": "2026-06-09T11:30:00Z"
}
```

---

### POST `/api/v1/checkout/payment/verify`

Verify payment success from gateway callback.

**Input**
```json
{
  "paymentSessionId": "pay_sess_xyz",
  "gatewayPaymentId": "pay_xyz9876",
  "gatewaySignature": "<HMAC signature from gateway>"
}
```

**Output**
```json
{
  "verified": true,
  "paymentReference": "pay_xyz9876"
}
```

---

## 8. Orders (Buyer)

### GET `/api/v1/orders`

Fetch the authenticated buyer's order list.

**Query Parameters**
| Param | Type | Description |
|---|---|---|
| `status` | string | `pending`, `processing`, `shipped`, `delivered`, `cancelled` |
| `page` | number | Default: 1 |
| `limit` | number | Default: 10 |

**Output**
```json
{
  "orders": [
    {
      "orderId": "#SW-20261",
      "product": "Hand-woven Terracotta Vase",
      "productImage": "https://cdn.swum.in/products/1/main.jpg",
      "artisan": "Laxman Singh",
      "quantity": 1,
      "amount": 3450,
      "status": "shipped",
      "orderedAt": "2026-06-08T10:00:00Z",
      "estimatedDelivery": "June 14, 2026",
      "deliveredAt": null
    }
  ],
  "statusCounts": {
    "all": 12,
    "pending": 2,
    "processing": 1,
    "shipped": 3,
    "delivered": 5,
    "cancelled": 1
  },
  "pagination": {
    "total": 12,
    "page": 1,
    "limit": 10,
    "totalPages": 2
  }
}
```

---

### GET `/api/v1/orders/:id`

Fetch order detail and live tracking timeline.

**Output**
```json
{
  "orderId": "#SW-20261",
  "status": "shipped",
  "amount": 3450,
  "item": {
    "productId": "1",
    "name": "Hand-Painted Blue Pottery Vase",
    "quantity": 1,
    "price": 3450,
    "image": "https://cdn.swum.in/products/1/main.jpg"
  },
  "artisan": {
    "id": "a1",
    "name": "Laxman Singh",
    "avatar": "https://cdn.swum.in/artisans/a1/avatar.jpg",
    "location": "Jaipur, Rajasthan",
    "certified": true
  },
  "shippingAddress": {
    "name": "Priya Deshmukh",
    "address": "12 Green Park, Andheri West",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pinCode": "400053"
  },
  "courier": {
    "name": "BlueDart Express",
    "trackingId": "BD928401263IN",
    "trackingUrl": "https://bluedart.com/track?id=BD928401263IN"
  },
  "timeline": [
    {
      "step": "Order Placed",
      "status": "done",
      "timestamp": "2026-06-08T10:00:00Z"
    },
    {
      "step": "Confirmed",
      "status": "done",
      "timestamp": "2026-06-08T14:30:00Z"
    },
    {
      "step": "In Transit",
      "status": "current",
      "timestamp": "2026-06-09T08:00:00Z"
    },
    {
      "step": "Out for Delivery",
      "status": "pending",
      "timestamp": null
    },
    {
      "step": "Delivered",
      "status": "pending",
      "timestamp": null
    }
  ],
  "orderedAt": "2026-06-08T10:00:00Z",
  "estimatedDelivery": "June 14, 2026"
}
```

---

### POST `/api/v1/orders/:id/cancel`

Cancel a pending or processing order.

**Input**
```json
{
  "reason": "Changed my mind"
}
```

**Output**
```json
{
  "orderId": "#SW-20261",
  "status": "cancelled",
  "refundInitiated": true,
  "refundEta": "5–7 business days"
}
```

---

### POST `/api/v1/orders/:id/review`

Submit a product review after delivery.

**Input**
```json
{
  "productId": "1",
  "rating": 5,
  "text": "Absolutely beautiful craftsmanship!"
}
```

**Output**
```json
{
  "reviewId": "r10",
  "rating": 5,
  "message": "Review submitted. Thank you!"
}
```

---

## 9. Returns

### POST `/api/v1/returns`

Submit a return request.

**Input**
```json
{
  "orderId": "#SW-20261",
  "items": [
    { "productId": "1", "quantity": 1 }
  ],
  "reason": "Product not as described",
  "condition": "opened_original_box",
  "photos": ["https://cdn.swum.in/returns/photo1.jpg"],
  "compensation": "original_payment | store_credit | bank_transfer"
}
```

**Output**
```json
{
  "returnId": "RET-1082",
  "orderId": "#SW-20261",
  "status": "initiated",
  "pickupDate": "June 12, 2026",
  "refundAmount": 3450,
  "refundEta": "5–7 business days after pickup",
  "compensation": "original_payment"
}
```

---

### GET `/api/v1/returns/:id`

Track the status of a return request.

**Output**
```json
{
  "returnId": "RET-1082",
  "orderId": "#SW-20261",
  "status": "pickup_scheduled | picked_up | received | refund_processed",
  "pickupDate": "June 12, 2026",
  "refundAmount": 3450,
  "refundProcessedAt": null
}
```

---

## 10. Notifications

### GET `/api/v1/notifications`

Fetch all notifications for the current user.

**Query Parameters**
| Param | Type | Description |
|---|---|---|
| `category` | string | `orders`, `deals`, `maker_stories`, `system` |
| `unreadOnly` | boolean | Only unread notifications |

**Output**
```json
{
  "notifications": [
    {
      "id": "n1",
      "category": "orders",
      "title": "Your order has been shipped!",
      "body": "Order #SW-20261 is on its way. Track it here.",
      "read": false,
      "createdAt": "2026-06-09T08:00:00Z",
      "actionUrl": "/orders/SW-20261"
    }
  ],
  "unreadCount": 3,
  "unreadByCategory": {
    "orders": 2,
    "deals": 1,
    "maker_stories": 0,
    "system": 0
  }
}
```

---

### PUT `/api/v1/notifications/:id/read`

Mark a single notification as read.

**Output**
```json
{
  "id": "n1",
  "read": true
}
```

---

### PUT `/api/v1/notifications/read-all`

Mark all notifications as read.

**Output**
```json
{
  "message": "All notifications marked as read.",
  "updatedCount": 3
}
```

---

## 11. Messages

### GET `/api/v1/messages/conversations`

Fetch all conversations for the current user.

**Query Parameters**
| Param | Type | Description |
|---|---|---|
| `search` | string | Search by participant name |

**Output**
```json
{
  "conversations": [
    {
      "conversationId": "conv_001",
      "participant": {
        "userId": "a1",
        "name": "Laxman Singh",
        "role": "artisan",
        "avatar": "https://cdn.swum.in/artisans/a1/avatar.jpg",
        "certified": true
      },
      "lastMessage": "Sure, I can make it in ivory...",
      "lastMessageAt": "2026-06-09T09:30:00Z",
      "unreadCount": 2
    }
  ]
}
```

---

### GET `/api/v1/messages/conversations/:id`

Fetch the message thread for a conversation.

**Output**
```json
{
  "conversationId": "conv_001",
  "participant": {
    "userId": "a1",
    "name": "Laxman Singh",
    "role": "artisan",
    "avatar": "https://cdn.swum.in/artisans/a1/avatar.jpg"
  },
  "messages": [
    {
      "messageId": "m1",
      "senderId": "usr_abc123",
      "senderRole": "buyer",
      "text": "Hi, do you do custom sizes?",
      "attachmentUrl": null,
      "sentAt": "2026-06-09T09:00:00Z",
      "read": true
    },
    {
      "messageId": "m2",
      "senderId": "a1",
      "senderRole": "artisan",
      "text": "Yes! Please share the dimensions.",
      "attachmentUrl": null,
      "sentAt": "2026-06-09T09:30:00Z",
      "read": false
    }
  ]
}
```

---

### POST `/api/v1/messages/conversations/:id/messages`

Send a message in a conversation.

**Input**
```json
{
  "text": "Can you also add a wooden base?",
  "attachmentUrl": "https://cdn.swum.in/messages/ref-photo.jpg"
}
```

**Output**
```json
{
  "messageId": "m3",
  "senderId": "usr_abc123",
  "text": "Can you also add a wooden base?",
  "attachmentUrl": null,
  "sentAt": "2026-06-09T10:00:00Z"
}
```

---

### POST `/api/v1/messages/conversations`

Start a new conversation (e.g. from an artisan's profile page).

**Input**
```json
{
  "recipientId": "a1",
  "text": "Hi! I love your work. Do you take custom orders?"
}
```

**Output**
```json
{
  "conversationId": "conv_005",
  "messageId": "m1"
}
```

---

## 12. User Settings

### PUT `/api/v1/users/me`

Update profile information.

**Input**
```json
{
  "fullName": "Priya Sharma",
  "phone": "9876543210",
  "location": "Mumbai, MH",
  "avatar": "https://cdn.swum.in/avatars/upload_ref"
}
```

**Output**
```json
{
  "userId": "usr_abc123",
  "fullName": "Priya Sharma",
  "phone": "9876543210",
  "location": "Mumbai, MH",
  "message": "Profile updated."
}
```

---

### PUT `/api/v1/users/me/password`

Change the account password.

**Input**
```json
{
  "currentPassword": "OldPass1!",
  "newPassword": "NewSecurePass2!"
}
```

**Output**
```json
{
  "message": "Password updated successfully."
}
```

---

### PUT `/api/v1/users/me/notifications`

Update notification preferences.

**Input**
```json
{
  "orderUpdates": true,
  "newArrivals": false,
  "makerStories": true,
  "deals": true,
  "accountAlerts": true
}
```

**Output**
```json
{
  "message": "Notification preferences saved."
}
```

---

### PUT `/api/v1/users/me/preferences`

Update language and region settings.

**Input**
```json
{
  "language": "hi",
  "currency": "INR"
}
```

**Output**
```json
{
  "language": "hi",
  "currency": "INR"
}
```

---

### GET `/api/v1/users/me/payment-methods`

Fetch saved payment methods.

**Output**
```json
{
  "paymentMethods": [
    {
      "id": "pm_001",
      "type": "card",
      "label": "HDFC Visa ···· 4242",
      "isDefault": true
    },
    {
      "id": "pm_002",
      "type": "upi",
      "label": "priya@upi",
      "isDefault": false
    }
  ]
}
```

---

### DELETE `/api/v1/users/me/payment-methods/:id`

Remove a saved payment method.

**Output**
```json
{
  "message": "Payment method removed."
}
```

---

### POST `/api/v1/users/me/2fa/enable`

Enable two-factor authentication.

**Output**
```json
{
  "qrCodeUrl": "https://cdn.swum.in/2fa/qr_usr_abc123.png",
  "backupCodes": ["ABCD-1234", "EFGH-5678"]
}
```

---

## 13. Seller — Onboarding

### POST `/api/v1/seller/onboarding`

Submit the seller registration wizard (all 5 steps in one call, or step-by-step — see note below).

**Input**
```json
{
  "identity": {
    "fullName": "Kamala Devi",
    "email": "kamala@example.com",
    "phone": "9876543210",
    "state": "Uttar Pradesh"
  },
  "craft": {
    "category": "Textiles & Weaving",
    "yearsExperience": 12
  },
  "story": {
    "bio": "After my husband fell ill, weaving became my lifeline...",
    "photos": [
      "https://cdn.swum.in/onboarding/photo1.jpg",
      "https://cdn.swum.in/onboarding/photo2.jpg"
    ]
  },
  "payment": {
    "bankAccountNumber": "123456789012",
    "ifscCode": "HDFC0001234",
    "accountHolderName": "Kamala Devi"
  }
}
```

**Output**
```json
{
  "sellerId": "sel_001",
  "status": "pending_review",
  "submittedAt": "2026-06-09T10:00:00Z",
  "reviewEta": "2–3 business days",
  "message": "Application submitted! We'll review and get back to you."
}
```

---

### GET `/api/v1/seller/onboarding/status`

Check the review status of a pending seller application.

**Output**
```json
{
  "status": "pending_review | approved | rejected | more_info_required",
  "submittedAt": "2026-06-09T10:00:00Z",
  "reviewNote": null
}
```

---

## 14. Seller — Products / Inventory

> All seller endpoints require `role: seller` in the JWT.

### GET `/api/v1/seller/products`

Fetch the seller's own product inventory.

**Query Parameters**
| Param | Type | Description |
|---|---|---|
| `search` | string | Search product name or SKU |
| `category` | string | Filter by category |
| `status` | string | `active`, `draft`, `pending_review`, `out_of_stock` |
| `page` | number | Default: 1 |
| `limit` | number | Default: 20 |

**Output**
```json
{
  "stats": {
    "totalProducts": 148,
    "activeListings": 132,
    "pendingReview": 9,
    "outOfStock": 7
  },
  "products": [
    {
      "id": "1",
      "name": "Hand-Painted Blue Pottery Vase",
      "sku": "POT-BPV-001",
      "category": "Pottery",
      "price": 3450,
      "stock": 3,
      "status": "active",
      "views": 1240,
      "image": "https://cdn.swum.in/products/1/main.jpg",
      "createdAt": "2026-01-10T08:00:00Z"
    }
  ],
  "pagination": {
    "total": 148,
    "page": 1,
    "limit": 20,
    "totalPages": 8
  }
}
```

---

### POST `/api/v1/seller/products`

Create a new product listing.

**Input**
```json
{
  "title": "Hand-Painted Blue Pottery Vase",
  "category": "Home Decor",
  "tags": ["pottery", "blue-pottery", "home-decor"],
  "description": "A masterpiece from the ancient blue pottery tradition...",
  "images": [
    "https://cdn.swum.in/uploads/img_abc.jpg",
    "https://cdn.swum.in/uploads/img_def.jpg"
  ],
  "material": "Quartz & Glass Powder",
  "technique": "Hand-painting with mineral pigments",
  "originRegion": "Jaipur, Rajasthan",
  "timeToProduce": "3–5 days",
  "price": 3450,
  "stock": 5,
  "sku": "POT-BPV-001"
}
```

**Output**
```json
{
  "productId": "1",
  "status": "pending_review",
  "message": "Product submitted for review. It'll go live within 24 hours."
}
```

---

### PUT `/api/v1/seller/products/:id`

Update an existing product listing.

**Input** — same fields as POST, all optional (partial update)

**Output**
```json
{
  "productId": "1",
  "status": "active",
  "message": "Product updated."
}
```

---

### DELETE `/api/v1/seller/products/:id`

Delete a product listing.

**Output**
```json
{
  "message": "Product deleted."
}
```

---

### POST `/api/v1/seller/products/bulk-action`

Apply a bulk action to multiple products.

**Input**
```json
{
  "productIds": ["1", "3", "5"],
  "action": "set_active | archive | delete"
}
```

**Output**
```json
{
  "affected": 3,
  "message": "3 products updated."
}
```

---

## 15. Seller — Orders

### GET `/api/v1/seller/orders`

Fetch all orders for the seller's products.

**Query Parameters**
| Param | Type | Description |
|---|---|---|
| `status` | string | `new`, `processing`, `shipped`, `delivered` |
| `page` | number | Default: 1 |
| `limit` | number | Default: 20 |

**Output**
```json
{
  "orders": [
    {
      "orderId": "#AD-9284",
      "product": "Hand-woven Terracotta Vase",
      "productImage": "https://cdn.swum.in/products/1/main.jpg",
      "quantity": 1,
      "customer": "Priya Deshmukh",
      "customerLocation": "Mumbai, MH",
      "status": "new",
      "amount": 3450,
      "orderedAt": "2026-06-08T10:00:00Z"
    }
  ],
  "statusCounts": {
    "new": 5,
    "processing": 12,
    "shipped": 8,
    "delivered": 94
  },
  "pagination": {
    "total": 119,
    "page": 1,
    "limit": 20,
    "totalPages": 6
  }
}
```

---

### PUT `/api/v1/seller/orders/:id/status`

Update the fulfilment status of an order.

**Input**
```json
{
  "status": "processing | shipped | delivered",
  "trackingId": "BD928401263IN",
  "courier": "BlueDart Express"
}
```

**Output**
```json
{
  "orderId": "#AD-9284",
  "status": "shipped",
  "message": "Order status updated."
}
```

---

## 16. Seller — Payouts

### GET `/api/v1/seller/payouts`

Fetch payout summary and transaction history.

**Output**
```json
{
  "summary": {
    "totalEarned": 184250,
    "thisMonth": 42850,
    "thisMonthGrowth": 18,
    "pendingPayout": 12400
  },
  "nextPayout": {
    "date": "June 15, 2026",
    "expectedArrival": "June 17, 2026",
    "bankAccount": "HDFC ···· 6789"
  },
  "monthlyChart": [
    { "month": "Jan", "gross": 28000, "net": 23800 },
    { "month": "Feb", "gross": 31000, "net": 26350 },
    { "month": "Mar", "gross": 26000, "net": 22100 },
    { "month": "Apr", "gross": 35000, "net": 29750 },
    { "month": "May", "gross": 38000, "net": 32300 },
    { "month": "Jun", "gross": 42850, "net": 36422 }
  ],
  "commissionRate": 15,
  "transactions": [
    {
      "transactionId": "txn_001",
      "date": "2026-06-07",
      "orderId": "#AD-9271",
      "product": "Carved Rosewood Elephant",
      "gross": 4200,
      "commission": 630,
      "net": 3570,
      "status": "paid"
    }
  ]
}
```

---

### POST `/api/v1/seller/payouts/request-early`

Request an early payout of the pending balance.

**Output**
```json
{
  "requestId": "epr_001",
  "amount": 12400,
  "expectedArrival": "June 11, 2026",
  "fee": 50,
  "message": "Early payout request submitted."
}
```

---

### PUT `/api/v1/seller/payouts/bank-account`

Update the linked bank account for payouts.

**Input**
```json
{
  "bankAccountNumber": "987654321098",
  "ifscCode": "ICIC0002345",
  "accountHolderName": "Kamala Devi"
}
```

**Output**
```json
{
  "message": "Bank account updated. New account active from next payout cycle."
}
```

---

## 17. Seller — Analytics

### GET `/api/v1/seller/analytics`

Fetch store analytics data.

**Query Parameters**
| Param | Type | Description |
|---|---|---|
| `period` | string | `last_30_days`, `last_90_days`, `last_6_months` |

**Output**
```json
{
  "kpis": {
    "totalViews": 17120,
    "totalViewsGrowth": 24,
    "totalOrders": 119,
    "totalOrdersGrowth": 18,
    "conversionRate": 0.7,
    "conversionRateGrowth": 0.2,
    "avgRating": 4.82,
    "avgRatingGrowth": 0.1
  },
  "trafficChart": [
    { "month": "Jan", "views": 2100 },
    { "month": "Feb", "views": 2450 },
    { "month": "Mar", "views": 2800 },
    { "month": "Apr", "views": 3100 },
    { "month": "May", "views": 3200 },
    { "month": "Jun", "views": 3470 }
  ],
  "ordersChart": [
    { "month": "Jan", "orders": 14 },
    { "month": "Feb", "orders": 18 }
  ],
  "topLocations": [
    { "city": "Mumbai", "percent": 28 },
    { "city": "Bangalore", "percent": 22 },
    { "city": "Delhi", "percent": 18 },
    { "city": "Hyderabad", "percent": 12 },
    { "city": "Others", "percent": 20 }
  ],
  "topProducts": [
    {
      "productId": "1",
      "name": "Hand-Painted Blue Pottery Vase",
      "views": 4200,
      "sales": 38,
      "revenue": 131100,
      "rating": 4.9
    }
  ]
}
```

---

## 18. Admin — Dashboard

> All admin endpoints require `role: admin` in the JWT.

### GET `/api/v1/admin/dashboard`

Fetch platform-wide KPIs and recent activity.

**Output**
```json
{
  "kpis": {
    "totalUsers": 24850,
    "totalUsersGrowth": 12.4,
    "activeSellers": 1240,
    "activeSellersGrowth": 8.1,
    "totalOrders": 8921,
    "totalOrdersGrowth": 15.2,
    "gmv": 4280000,
    "gmvGrowth": 18.5
  },
  "platformHealth": {
    "pendingVerifications": 23,
    "openDisputes": 7,
    "ordersToday": 142,
    "commissionEarned": 120000
  },
  "revenueChart": [
    { "month": "Jan", "gmv": 580000 },
    { "month": "Feb", "gmv": 620000 },
    { "month": "Mar", "gmv": 690000 },
    { "month": "Apr", "gmv": 740000 },
    { "month": "May", "gmv": 810000 },
    { "month": "Jun", "gmv": 840000 }
  ],
  "recentOrders": [
    {
      "orderId": "#AD-9284",
      "buyer": "Priya Deshmukh",
      "seller": "Kamala Devi",
      "amount": 3450,
      "status": "new",
      "orderedAt": "2026-06-08T10:00:00Z"
    }
  ]
}
```

---

## 19. Admin — Users

### GET `/api/v1/admin/users`

Fetch paginated user list with search and role filter.

**Query Parameters**
| Param | Type | Description |
|---|---|---|
| `search` | string | Search by name or email |
| `role` | string | `buyer`, `seller` |
| `status` | string | `active`, `suspended` |
| `page` | number | Default: 1 |
| `limit` | number | Default: 20 |

**Output**
```json
{
  "totalUsers": 24850,
  "users": [
    {
      "userId": "usr_001",
      "fullName": "Priya Deshmukh",
      "email": "priya@example.com",
      "role": "buyer",
      "location": "Mumbai, MH",
      "joinedAt": "2025-09-01T00:00:00Z",
      "ordersCount": 8,
      "totalSpent": 24600,
      "status": "active",
      "avatar": "https://cdn.swum.in/avatars/usr_001.jpg"
    }
  ],
  "pagination": {
    "total": 24850,
    "page": 1,
    "limit": 20,
    "totalPages": 1243
  }
}
```

---

### PUT `/api/v1/admin/users/:id/status`

Suspend or reactivate a user account.

**Input**
```json
{
  "status": "suspended | active",
  "reason": "Violation of seller terms"
}
```

**Output**
```json
{
  "userId": "usr_001",
  "status": "suspended",
  "message": "User suspended."
}
```

---

## 20. Admin — Orders

### GET `/api/v1/admin/orders`

Fetch all platform orders with filters.

**Query Parameters**
| Param | Type | Description |
|---|---|---|
| `status` | string | `new`, `processing`, `shipped`, `delivered`, `cancelled` |
| `search` | string | Search by order ID, buyer, or seller |
| `page` | number | Default: 1 |
| `limit` | number | Default: 20 |

**Output**
```json
{
  "orders": [
    {
      "orderId": "#AD-9284",
      "buyer": "Priya Deshmukh",
      "seller": "Kamala Devi",
      "product": "Hand-woven Terracotta Vase",
      "amount": 3450,
      "commission": 517,
      "status": "new",
      "orderedAt": "2026-06-08T10:00:00Z"
    }
  ],
  "pagination": {
    "total": 8921,
    "page": 1,
    "limit": 20,
    "totalPages": 447
  }
}
```

---

## Services Summary

| Service | Purpose |
|---|---|
| **Auth Service** | JWT issue/validate, Google OAuth, password reset tokens |
| **Product Service** | CRUD for product listings, search & filter, review aggregation |
| **Cart Service** | Session-linked cart, quantity management, coupon validation |
| **Order Service** | Order lifecycle, status tracking, cancellation, buyer reviews |
| **Payment Service** | Payment gateway integration (Razorpay / PayU), verification |
| **Notification Service** | Push/in-app notifications, category management, read state |
| **Messaging Service** | Real-time conversation threads (WebSocket recommended) |
| **Seller Service** | Onboarding, inventory management, payout scheduling |
| **Analytics Service** | Traffic, sales, conversion aggregation per seller |
| **Admin Service** | Platform KPIs, user moderation, dispute management |
| **Upload Service** | Signed URL generation for product images, avatars, return photos |
| **Coupon Service** | Coupon validation, discount calculation |
| **Returns Service** | Return request lifecycle, refund initiation |
| **Shipping Service** | Address validation, courier API integration, tracking updates |

---

## Common Error Format

All error responses follow this shape:

```json
{
  "error": "ERROR_CODE",
  "message": "Human-readable description of the error.",
  "field": "email"
}
```

**Common error codes:**

| Code | HTTP Status | Meaning |
|---|---|---|
| `UNAUTHORIZED` | 401 | Missing or invalid auth token |
| `FORBIDDEN` | 403 | Insufficient role permissions |
| `NOT_FOUND` | 404 | Resource does not exist |
| `VALIDATION_ERROR` | 422 | Invalid input — `field` indicates which |
| `INVALID_COUPON` | 422 | Coupon not valid or expired |
| `OUT_OF_STOCK` | 409 | Requested quantity exceeds available stock |
| `PAYMENT_FAILED` | 402 | Payment gateway returned a failure |
| `DUPLICATE_EMAIL` | 409 | Email already registered |
| `INTERNAL_ERROR` | 500 | Unexpected server error |
