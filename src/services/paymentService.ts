/**
 * 결제 서비스
 * 한국: 토스페이먼츠 / 해외: Stripe
 */

import { apiPost, apiGet } from '../utils/apiClient';
import {
  PaymentProvider,
  PlanType,
  StripeCheckoutRequest,
  StripeCheckoutResponse,
  TossConfirmRequest,
  TossConfirmResponse,
  PaymentsResponse,
  Payment,
} from '../types/api';
import { PLANS, PLANS_KRW } from '../types/subscription';

/**
 * 사용자 지역에 따른 결제 제공자 결정
 */
export const getPaymentProvider = (): PaymentProvider => {
  // 브라우저 언어 또는 저장된 설정으로 판단
  const language = navigator.language || 'en';
  const isKorean = language.startsWith('ko');
  
  // localStorage에 저장된 설정이 있으면 우선 사용
  const savedProvider = localStorage.getItem('payment_provider');
  if (savedProvider === 'toss' || savedProvider === 'stripe') {
    return savedProvider;
  }
  
  return isKorean ? 'toss' : 'stripe';
};

/**
 * 플랜에 따른 가격 조회
 */
export const getPlanPrice = (planId: PlanType, provider: PaymentProvider): { amount: number; currency: 'USD' | 'KRW' } => {
  if (provider === 'toss') {
    return {
      amount: PLANS_KRW[planId],
      currency: 'KRW',
    };
  }
  return {
    amount: PLANS[planId].price,
    currency: 'USD',
  };
};

/**
 * Stripe 결제 세션 생성
 */
export const createStripeCheckoutSession = async (
  planId: PlanType
): Promise<StripeCheckoutResponse> => {
  const request: StripeCheckoutRequest = {
    plan_id: planId,
    success_url: `${window.location.origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${window.location.origin}/payment/cancel`,
  };

  const response = await apiPost<StripeCheckoutResponse>('/payments/stripe/checkout', request);
  
  if (!response.data) {
    throw new Error('Failed to create checkout session');
  }

  return response.data;
};

/**
 * Stripe 결제 페이지로 리다이렉트
 */
export const redirectToStripeCheckout = async (planId: PlanType): Promise<void> => {
  const session = await createStripeCheckoutSession(planId);
  window.location.href = session.url;
};

/**
 * 토스페이먼츠 결제 승인
 */
export const confirmTossPayment = async (
  paymentKey: string,
  orderId: string,
  amount: number
): Promise<TossConfirmResponse> => {
  const request: TossConfirmRequest = {
    payment_key: paymentKey,
    order_id: orderId,
    amount,
  };

  const response = await apiPost<TossConfirmResponse>('/payments/toss/confirm', request);
  
  if (!response.data) {
    throw new Error('Payment confirmation failed');
  }

  return response.data;
};

/**
 * 통합 결제 시작
 */
export const initiatePayment = async (
  planId: PlanType
): Promise<{ success: boolean; error?: string }> => {
  const provider = getPaymentProvider();

  try {
    if (provider === 'stripe') {
      await redirectToStripeCheckout(planId);
      return { success: true };
    } else {
      // 토스페이먼츠는 클라이언트 SDK를 사용해야 함
      // 여기서는 결제 정보만 준비하고, 실제 결제는 클라이언트에서 처리
      return { 
        success: true,
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Payment initiation failed',
    };
  }
};

/**
 * 구독 취소
 */
export const cancelSubscription = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    await apiPost('/subscriptions/me/cancel');
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Subscription cancellation failed',
    };
  }
};

/**
 * 구독 재활성화
 */
export const reactivateSubscription = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    await apiPost('/subscriptions/me/reactivate');
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Subscription reactivation failed',
    };
  }
};

/**
 * 결제 내역 조회
 */
export const getPaymentHistory = async (
  limit: number = 20,
  offset: number = 0
): Promise<Payment[]> => {
  const response = await apiGet<PaymentsResponse>('/payments/history', {
    limit: limit.toString(),
    offset: offset.toString(),
  });
  
  if (!response.data) {
    throw new Error('Failed to fetch payment history');
  }
  
  return response.data.payments;
};
