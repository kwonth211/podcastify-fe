/**
 * 결제 관련 타입 정의
 */

export type PaymentProvider = 'stripe' | 'toss';

export type PaymentStatus = 
  | 'pending' 
  | 'processing' 
  | 'completed' 
  | 'failed' 
  | 'canceled' 
  | 'refunded';

export interface PaymentIntent {
  id: string;
  provider: PaymentProvider;
  amount: number;
  currency: 'USD' | 'KRW';
  status: PaymentStatus;
  planId: string;
  userId: string;
  createdAt: string;
}

export interface PaymentResult {
  success: boolean;
  paymentId?: string;
  subscriptionId?: string;
  error?: string;
}

// Stripe 관련 타입
export interface StripePaymentRequest {
  planId: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}

export interface StripeCheckoutSession {
  sessionId: string;
  url: string;
}

// 토스페이먼츠 관련 타입
export interface TossPaymentRequest {
  orderId: string;
  orderName: string;
  amount: number;
  customerEmail: string;
  customerName: string;
  successUrl: string;
  failUrl: string;
}

export interface TossPaymentConfirm {
  paymentKey: string;
  orderId: string;
  amount: number;
}

export interface TossPaymentResult {
  paymentKey: string;
  orderId: string;
  status: string;
  totalAmount: number;
  method: string;
  requestedAt: string;
  approvedAt?: string;
}

// 결제 수단
export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_transfer';
  provider: PaymentProvider;
  last4?: string;
  brand?: string;
  isDefault: boolean;
}

// 결제 내역
export interface PaymentHistory {
  id: string;
  userId: string;
  amount: number;
  currency: 'USD' | 'KRW';
  status: PaymentStatus;
  provider: PaymentProvider;
  planId: string;
  description: string;
  createdAt: string;
}
