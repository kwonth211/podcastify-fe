/**
 * 구독 플랜 및 크레딧 관련 타입 정의
 */

export type PlanType = 'free' | 'basic' | 'pro';

export interface Plan {
  id: PlanType;
  name: string;
  price: number;
  currency: 'USD' | 'KRW';
  period: 'month' | 'year' | 'once';
  features: PlanFeatures;
}

export interface PlanFeatures {
  schedulerEnabled: boolean;   // 스케줄러 사용 가능 여부
  maxSchedules: number;        // 최대 스케줄 개수 (0 = 불가, -1 = 무제한)
  premiumVoices: boolean;      // 프리미엄 음성 사용 가능
  priorityCrawling: boolean;   // 우선 크롤링
  rssFeed: boolean;            // RSS 피드 제공
  batchTokens: number;         // 배치 토큰 개수 (수동 생성 + 스케줄러 실행 공통 사용)
  batchTokenValidityDays: number; // 배치 토큰 유효기간 (일)
}

export interface Subscription {
  id: string;
  userId: string;
  planId: PlanType;
  status: SubscriptionStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
  updatedAt: string;
}

export type SubscriptionStatus = 
  | 'active' 
  | 'canceled' 
  | 'past_due' 
  | 'trialing' 
  | 'unpaid';

export interface Credits {
  userId: string;
  generationsUsed: number;
  generationsLimit: number;
  resetDate: string;
}

export interface BatchToken {
  id: string;
  userId: string;
  tokensRemaining: number;     // 남은 토큰 개수
  tokensTotal: number;          // 총 토큰 개수
  validUntil: string;           // 유효기간 만료일
  createdAt: string;
  updatedAt: string;
}

export interface Schedule {
  id: string;
  userId: string;
  prompt: string;
  days: DayOfWeek[];
  time: string; // HH:mm format
  timezone: string;
  email: string;
  isActive: boolean;
  lastRun?: string;
  nextRun?: string;
  createdAt: string;
  updatedAt: string;
}

export type DayOfWeek = 
  | 'monday' 
  | 'tuesday' 
  | 'wednesday' 
  | 'thursday' 
  | 'friday' 
  | 'saturday' 
  | 'sunday';

// 플랜 정의
export const PLANS: Record<PlanType, Plan> = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    currency: 'USD',
    period: 'month',
    features: {
      schedulerEnabled: true,
      maxSchedules: 7, // 배치 토큰 개수와 동일 (7개)
      premiumVoices: false,
      priorityCrawling: false,
      rssFeed: false,
      batchTokens: 7,           // 배치 토큰 7개 (수동 생성 7회 또는 스케줄러 7회 실행)
      batchTokenValidityDays: 7, // 7일 유효
    },
  },
  basic: {
    id: 'basic',
    name: 'Basic',
    price: 1,
    currency: 'USD',
    period: 'month',
    features: {
      schedulerEnabled: true,
      maxSchedules: 30, // 배치 토큰 개수와 동일 (30개)
      premiumVoices: false,
      priorityCrawling: false,
      rssFeed: false,
      batchTokens: 30,          // 배치 토큰 30개 (수동 생성 30회 또는 스케줄러 30회 실행)
      batchTokenValidityDays: 30, // 30일 유효
    },
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 10,
    currency: 'USD',
    period: 'month',
    features: {
      schedulerEnabled: true,
      maxSchedules: -1, // 무제한
      premiumVoices: true,
      priorityCrawling: true,
      rssFeed: true,
      batchTokens: -1,          // 무제한 배치 토큰
      batchTokenValidityDays: -1, // 무제한 유효기간
    },
  },
};

// KRW 가격 (대략적인 환율 적용)
export const PLANS_KRW: Record<PlanType, number> = {
  free: 0,
  basic: 1300,
  pro: 15000,
};
