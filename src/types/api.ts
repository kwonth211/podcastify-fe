/**
 * API 타입 정의
 * BACKEND_SPEC.md 기반
 */

// ============================================
// 공통 타입
// ============================================

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    [key: string]: any;
  };
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    items: T[];
    total: number;
    limit: number;
    offset: number;
  };
}

export type ErrorCode =
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'INSUFFICIENT_CREDITS'
  | 'INSUFFICIENT_BATCH_TOKENS'
  | 'SCHEDULE_LIMIT_EXCEEDED'
  | 'PLAN_FEATURE_DISABLED'
  | 'PAYMENT_FAILED'
  | 'RATE_LIMIT_EXCEEDED'
  | 'INTERNAL_ERROR';

// ============================================
// 사용자 타입
// ============================================

export interface User {
  id: string;
  email: string;
  name: string;
  picture: string | null;
  created_at: string;
}

export interface UserStats extends User {
  plan_id: PlanType;
  subscription_status: SubscriptionStatus;
  generations_used: number;
  generations_limit: number;
  batch_tokens_remaining: number;
  active_schedules: number;
  total_podcasts: number;
}

// ============================================
// 구독 타입
// ============================================

export type PlanType = 'free' | 'basic' | 'pro';
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trialing' | 'unpaid';

export interface PlanFeatures {
  plan_id: PlanType;
  name: string;
  price_usd: number;
  price_krw: number;
  generations_per_month: number; // -1 = unlimited
  scheduler_enabled: boolean;
  max_schedules: number; // -1 = unlimited
  premium_voices: boolean;
  priority_crawling: boolean;
  rss_feed: boolean;
  batch_tokens: number; // -1 = unlimited
  batch_token_validity_days: number; // -1 = no expiry
}

export interface Subscription {
  id: string;
  user_id: string;
  plan_id: PlanType;
  status: SubscriptionStatus;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  features?: PlanFeatures;
  created_at: string;
  updated_at: string;
}

export interface PlansResponse {
  plans: Record<PlanType, PlanFeatures>;
}

// ============================================
// 크레딧 타입
// ============================================

export interface Credits {
  user_id: string;
  generations_used: number;
  generations_limit: number; // -1 = unlimited
  remaining: number;
  reset_date: string;
}

export interface BatchTokens {
  user_id: string;
  tokens_remaining: number; // -1 = unlimited
  tokens_total: number; // -1 = unlimited
  tokens_used: number;
  valid_until: string;
  is_expired: boolean;
  created_at: string;
  updated_at: string;
}

// ============================================
// 스케줄 타입
// ============================================

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
export type Language = 'ko' | 'en' | 'ja' | 'zh';
export type TTSModel = 'gemini' | 'openai' | 'edge' | 'elevenlabs';

export interface Schedule {
  id: string;
  user_id: string;
  name: string;
  prompt: string;
  days: DayOfWeek[];
  time: string; // HH:MM format
  timezone: string; // IANA timezone
  email: string;
  language: Language;
  tts_model: TTSModel;
  is_active: boolean;
  last_run: string | null;
  next_run: string | null;
  run_count: number;
  failure_count: number;
  created_at: string;
  updated_at: string;
}

export interface ScheduleCreate {
  name?: string;
  prompt: string;
  days: DayOfWeek[];
  time: string;
  timezone?: string;
  email: string;
  language?: Language;
  tts_model?: TTSModel;
  is_active?: boolean;
}

export interface ScheduleUpdate {
  name?: string;
  prompt?: string;
  days?: DayOfWeek[];
  time?: string;
  timezone?: string;
  email?: string;
  language?: Language;
  tts_model?: TTSModel;
  is_active?: boolean;
}

export interface SchedulesResponse {
  schedules: Schedule[];
  total: number;
}

export interface ScheduleTestResponse {
  podcast_id: string;
  status: 'generating';
}

// ============================================
// 팟캐스트 타입
// ============================================

export type PodcastStatus = 'pending' | 'generating' | 'completed' | 'failed';
export type StepStatus = 'pending' | 'in_progress' | 'completed' | 'failed';

export interface Podcast {
  id: string;
  user_id: string;
  schedule_id: string | null;
  prompt: string;
  title: string | null;
  audio_url: string | null;
  transcript_url: string | null;
  duration: number | null; // seconds
  status: PodcastStatus;
  play_count: number;
  created_at: string;
}

export interface PodcastDetail extends Podcast {
  script: string | null;
  sources_url: string | null;
  file_size: number | null; // bytes
  error_message: string | null;
  metadata: Record<string, any>;
  updated_at: string;
}

export interface PodcastGenerateRequest {
  prompt: string;
  language?: Language;
  tts_model?: TTSModel;
  longform?: boolean;
}

export interface PodcastGenerateResponse {
  podcast_id: string;
  status: PodcastStatus;
  estimated_time: number; // seconds
}

export interface GenerationStep {
  id: 'prompting' | 'crawling' | 'summarizing' | 'generating';
  status: StepStatus;
  message: string | null;
}

export interface PodcastStatusResponse {
  id: string;
  status: PodcastStatus;
  progress: number; // 0-100
  current_step: string | null;
  steps: GenerationStep[];
  error_message: string | null;
}

export interface PodcastsResponse {
  podcasts: Podcast[];
  total: number;
  limit: number;
  offset: number;
}

// ============================================
// 결제 타입
// ============================================

export type PaymentProvider = 'stripe' | 'toss';
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'canceled' | 'refunded';

export interface Payment {
  id: string;
  user_id: string;
  plan_id: PlanType;
  amount: number;
  currency: 'USD' | 'KRW';
  provider: PaymentProvider;
  status: PaymentStatus;
  paid_at: string | null;
  created_at: string;
}

export interface StripeCheckoutRequest {
  plan_id: PlanType;
  success_url: string;
  cancel_url: string;
}

export interface StripeCheckoutResponse {
  session_id: string;
  url: string;
}

export interface TossConfirmRequest {
  payment_key: string;
  order_id: string;
  amount: number;
}

export interface TossConfirmResponse {
  payment_key: string;
  order_id: string;
  status: string;
  total_amount: number;
  method: string;
  approved_at: string;
}

export interface PaymentsResponse {
  payments: Payment[];
  total: number;
}
