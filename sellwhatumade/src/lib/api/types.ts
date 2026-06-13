/**
 * TypeScript types mirroring the SellWhatUMade backend API contract.
 * Money is always represented in paise (integer). Use formatPaise() to display.
 */

export type UserRole = "user" | "seller" | "admin" | "sales_agent";

export interface AuthUser {
  userId: string;
  fullName: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  location?: string;
  language?: string;
  currency?: string;
  createdAt?: string;
}

/** Shape returned by /auth/login and /auth/signup (tokens stripped before reaching the browser). */
export interface AuthSessionResponse {
  userId: string;
  fullName?: string;
  email?: string;
  role: UserRole;
  token: string;
  refreshToken: string;
  expiresAt: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

// ── Catalog ──────────────────────────────────────────────────────────────────

export type ProductStatus =
  | "draft"
  | "active"
  | "paused"
  | "out_of_stock"
  | "deleted";

export interface ProductVariant {
  sku: string;
  label: string;
  pricePaise: number;
  mrpPaise: number;
  stock: number;
  images: string[];
}

export interface ProductDimensions {
  lengthCm?: number;
  widthCm?: number;
  heightCm?: number;
  weightGrams?: number;
}

export interface Product {
  _id: string;
  sellerId: string;
  categoryId: string;
  subcategoryId?: string;
  name: string;
  description: string;
  pricePaise: number;
  mrpPaise: number;
  stock: number;
  sku: string;
  images: string[];
  variants: ProductVariant[];
  materials: string[];
  tags: string[];
  dimensions?: ProductDimensions;
  isHandmade: boolean;
  isCustomizable: boolean;
  customizationNote?: string;
  deliveryDays: number;
  status: ProductStatus;
  rating: number;
  reviewCount: number;
  totalSold: number;
  viewCount: number;
  isFeatured: boolean;
  gstRatePercent: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  parentId?: string | null;
  image?: string;
  icon?: string;
  description?: string;
  productCount?: number;
  children?: Category[];
}

export interface Review {
  _id: string;
  productId: string;
  userId: string;
  userName?: string;
  rating: number;
  title?: string;
  comment?: string;
  images?: string[];
  helpfulCount?: number;
  sellerResponse?: { message: string; respondedAt: string };
  isVerifiedPurchase?: boolean;
  status?: string;
  createdAt?: string;
}

// ── Cart ─────────────────────────────────────────────────────────────────────

export interface CartItem {
  productId: string;
  name: string;
  image: string;
  variantSku?: string;
  quantity: number;
  pricePaise: number;
  mrpPaise: number;
}

export interface CartSummary {
  itemCount: number;
  subtotalPaise: number;
  deliveryFeePaise: number;
  couponDiscountPaise: number;
  coinDiscountPaise: number;
  totalPaise: number;
}

export interface Cart {
  _id?: string;
  userId?: string;
  items: CartItem[];
  couponCode?: string;
  couponDiscountPaise?: number;
  coinsToRedeem?: number;
  coinDiscountPaise?: number;
  /** Present only on GET /buyer/v1/cart. */
  summary?: CartSummary;
}

// ── Orders ───────────────────────────────────────────────────────────────────

export type OrderStatus =
  | "pending_payment"
  | "payment_failed"
  | "confirmed"
  | "processing"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "return_requested"
  | "return_approved"
  | "returned"
  | "refunded";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded" | "partially_refunded";

export interface OrderItem {
  productId: string;
  sellerId?: string;
  name: string;
  image?: string;
  variantSku?: string;
  quantity: number;
  unitPricePaise: number;
  totalPricePaise: number;
  isReviewed?: boolean;
}

export interface StatusHistoryEntry {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export interface Address {
  recipientName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country?: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  userId?: string;
  items: OrderItem[];
  shippingAddress: Address;
  status: OrderStatus;
  statusHistory?: StatusHistoryEntry[];
  subtotalPaise: number;
  deliveryFeePaise?: number;
  couponDiscountPaise?: number;
  coinDiscountPaise?: number;
  totalPaise: number;
  paymentStatus?: PaymentStatus;
  couponCode?: string;
  trackingNumber?: string;
  shippingProvider?: string;
  estimatedDeliveryDate?: string;
  deliveredAt?: string;
  cancellationReason?: string;
  returnReason?: string;
  createdAt?: string;
  updatedAt?: string;
}

/** Response from POST /buyer/v1/checkout (Razorpay order init). */
export interface CheckoutInitResponse {
  orderId: string;
  orderNumber?: string;
  razorpayOrderId: string;
  razorpayKeyId?: string;
  totalPaise: number;
  currency: string;
}

// ── Seller ───────────────────────────────────────────────────────────────────

export type ArtisanType = "individual" | "group" | "cooperative" | "shg";

export interface SellerAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country?: string;
}

export interface SellerProfile {
  _id?: string;
  userId?: string;
  shopName: string;
  shopDescription?: string;
  shopLogo?: string;
  shopBanner?: string;
  artisanType?: ArtisanType;
  specialization?: string;
  yearsExperience?: number;
  address?: SellerAddress;
  whatsappNumber?: string;
  instagramHandle?: string;
  websiteUrl?: string;
  isVerified?: boolean;
  isActive?: boolean;
  rating?: number;
  ratingCount?: number;
  totalOrders?: number;
  totalProducts?: number;
  createdAt?: string;
}

export type KycStatus =
  | "not_submitted"
  | "pending"
  | "under_review"
  | "approved"
  | "rejected";

export interface KycInfo {
  status: KycStatus;
  rejectionReason?: string;
  bankAccountNumber?: string;
  ifscCode?: string;
  accountHolderName?: string;
  bankName?: string;
  panNumber?: string;
  submittedAt?: string;
}

export interface EarningsDashboard {
  availableBalancePaise: number;
  totalEarnedPaise: number;
  totalPaidOutPaise: number;
}

export interface Payout {
  _id: string;
  amountPaise: number;
  status: string;
  createdAt?: string;
  processedAt?: string;
}

export interface LedgerEntry {
  _id: string;
  type: string;
  amountPaise: number;
  balancePaise: number;
  description?: string;
  createdAt?: string;
}

// ── Notifications / Coins ──────────────────────────────────────────────────────

export interface Notification {
  _id: string;
  title: string;
  body?: string;
  type?: string;
  isRead: boolean;
  createdAt?: string;
  data?: Record<string, unknown>;
}

export interface CoinBalance {
  balance: number;
  valuePaise?: number;
}
