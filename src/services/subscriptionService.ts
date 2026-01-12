/**
 * 구독 서비스
 */

import { apiGet, apiPost } from '../utils/apiClient';
import { Subscription, PlansResponse, PlanFeatures } from '../types/api';

/**
 * 모든 플랜 목록 조회
 */
export const getPlans = async (): Promise<Record<string, PlanFeatures>> => {
  const response = await apiGet<PlansResponse>('/subscriptions/plans');
  
  if (!response.data) {
    throw new Error('Failed to fetch plans');
  }
  
  return response.data.plans;
};

/**
 * 현재 구독 정보 조회
 */
export const getSubscription = async (): Promise<Subscription> => {
  const response = await apiGet<Subscription>('/subscriptions/me');
  
  if (!response.data) {
    throw new Error('Failed to fetch subscription');
  }
  
  return response.data;
};

/**
 * 구독 취소
 */
export const cancelSubscription = async (): Promise<{ cancel_at_period_end: boolean; current_period_end: string }> => {
  const response = await apiPost<{ cancel_at_period_end: boolean; current_period_end: string }>('/subscriptions/me/cancel');
  
  if (!response.data) {
    throw new Error('Failed to cancel subscription');
  }
  
  return response.data;
};

/**
 * 구독 재활성화
 */
export const reactivateSubscription = async (): Promise<Subscription> => {
  const response = await apiPost<Subscription>('/subscriptions/me/reactivate');
  
  if (!response.data) {
    throw new Error('Failed to reactivate subscription');
  }
  
  return response.data;
};
