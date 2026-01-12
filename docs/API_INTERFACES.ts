/**
 * Daily News Podcast - API 인터페이스 정의
 * Backend 개발 시 참고용 TypeScript 타입 정의
 */

// ============================================
// 공통 타입
// ============================================

export type UUID = string;
export type ISODateString = string; // "2024-01-15T08:00:00Z"
export type TimeString = string; // "08:00"

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: ErrorCode;
    message: string;
  };
}

export type ErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "INSUFFICIENT_CREDITS"
  | "SCHEDULE_LIMIT_EXCEEDED"
  | "PLAN_FEATURE_DISABLED"
  | "PAYMENT_FAILED"
  | "VALIDATION_ERROR"
  | "INTERNAL_ERROR";

// ============================================
// 사용자 (User)
// ============================================

export interface User {
  id: UUID;
  googleId: string;
  email: string;
  name: string;
  picture: string | null;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface CreateUserRequest {
  googleId: string;
  email: string;
  name: string;
  picture?: string;
}

// ============================================
// 인증 (Auth)
// ============================================

export interface GoogleAuthRequest {
  code: string;
  redirectUri: string;
}

export interface GoogleAuthResponse {
  token: string;
  user: User;
}

// ============================================
// 구독 (Subscription)
// ============================================

export type PlanType = "free" | "basic" | "pro";

export type SubscriptionStatus =
  | "active"
  | "canceled"
  | "past_due"
  | "trialing"
  | "unpaid";

export interface Subscription {
  id: UUID;
  userId: UUID;
  planId: PlanType;
  status: SubscriptionStatus;
  currentPeriodStart: ISODateString;
  currentPeriodEnd: ISODateString;
  cancelAtPeriodEnd: boolean;
  stripeSubscriptionId?: string;
  tossSubscriptionId?: string;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface PlanFeatures {
  schedulerEnabled: boolean;
  maxSchedules: number; // 0 = not available, -1 = unlimited
  premiumVoices: boolean;
  priorityCrawling: boolean;
  rssFeed: boolean;
  batchTokens: number; // 배치 토큰 개수 (수동 생성 + 스케줄러 실행 공통 사용, -1 = unlimited)
  batchTokenValidityDays: number; // 배치 토큰 유효기간 일수 (-1 = unlimited)
}

export interface Plan {
  id: PlanType;
  name: string;
  price: {
    USD: number; // cents
    KRW: number; // won
  };
  stripePriceId?: string;
  features: PlanFeatures;
}

// ============================================
// 크레딧 (Credits)
// ============================================

export interface Credits {
  id: UUID;
  userId: UUID;
  generationsUsed: number;
  generationsLimit: number;
  resetDate: ISODateString;
  updatedAt: ISODateString;
}

export interface UseCreditsRequest {
  userId: UUID;
}

export interface UseCreditsResponse {
  generationsUsed: number;
  generationsLimit: number;
  remaining: number;
}

// ============================================
// 배치 토큰 (Batch Tokens)
// ============================================

export interface BatchToken {
  id: UUID;
  userId: UUID;
  tokensRemaining: number;
  tokensTotal: number;
  validUntil: ISODateString;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface UseBatchTokenRequest {
  userId: UUID;
}

export interface UseBatchTokenResponse {
  tokensRemaining: number;
  tokensTotal: number;
  validUntil: ISODateString;
}

export interface RefillBatchTokenRequest {
  userId: UUID;
  planId: PlanType;
}

export interface RefillBatchTokenResponse {
  tokensRemaining: number;
  tokensTotal: number;
  validUntil: ISODateString;
}

// ============================================
// 스케줄 (Schedule)
// ============================================

export type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export interface Schedule {
  id: UUID;
  userId: UUID;
  prompt: string;
  days: DayOfWeek[];
  time: TimeString;
  timezone: string;
  email: string;
  isActive: boolean;
  lastRun: ISODateString | null;
  nextRun: ISODateString | null;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface CreateScheduleRequest {
  userId: UUID;
  prompt: string;
  days: DayOfWeek[];
  time: TimeString;
  timezone: string;
  email: string;
  isActive?: boolean;
}

export interface UpdateScheduleRequest {
  prompt?: string;
  days?: DayOfWeek[];
  time?: TimeString;
  timezone?: string;
  email?: string;
  isActive?: boolean;
}

export interface TestScheduleResponse {
  podcastId: UUID;
  status: "generating";
}

// ============================================
// 팟캐스트 (Podcast)
// ============================================

export type PodcastStatus = "pending" | "generating" | "completed" | "failed";

export interface Podcast {
  id: UUID;
  userId: UUID;
  scheduleId: UUID | null;
  prompt: string;
  title: string | null;
  script: string | null;
  audioUrl: string | null;
  duration: number | null; // seconds
  status: PodcastStatus;
  playCount: number;
  errorMessage: string | null;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface GeneratePodcastRequest {
  userId: UUID;
  prompt: string;
}

export interface GeneratePodcastResponse {
  podcastId: UUID;
  status: "generating";
  estimatedTime: number; // seconds
}

export interface PodcastStatusResponse {
  id: UUID;
  status: PodcastStatus;
  progress: number; // 0-100
  currentStep: WorkflowStep | null;
  steps: WorkflowStepStatus[];
}

export type WorkflowStep =
  | "prompting"
  | "crawling"
  | "summarizing"
  | "generating";

export interface WorkflowStepStatus {
  id: WorkflowStep;
  status: "pending" | "in_progress" | "completed" | "failed";
}

export interface PodcastListResponse {
  podcasts: Podcast[];
  total: number;
  limit: number;
  offset: number;
}

export interface PodcastListParams {
  userId: UUID;
  status?: PodcastStatus;
  limit?: number;
  offset?: number;
}

// ============================================
// 결제 (Payment)
// ============================================

export type PaymentProvider = "stripe" | "toss";

export type PaymentStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "canceled"
  | "refunded";

export interface Payment {
  id: UUID;
  userId: UUID;
  planId: PlanType;
  amount: number;
  currency: "USD" | "KRW";
  provider: PaymentProvider;
  providerPaymentId: string | null;
  status: PaymentStatus;
  description: string | null;
  createdAt: ISODateString;
}

// Stripe
export interface StripeCheckoutRequest {
  planId: PlanType;
  userId: UUID;
  successUrl: string;
  cancelUrl: string;
}

export interface StripeCheckoutResponse {
  sessionId: string;
  url: string;
}

// Toss
export interface TossConfirmRequest {
  paymentKey: string;
  orderId: string;
  amount: number;
}

export interface TossConfirmResponse {
  paymentKey: string;
  orderId: string;
  status: string;
  totalAmount: number;
  method: string;
  requestedAt: ISODateString;
  approvedAt: ISODateString | null;
}

// ============================================
// API 엔드포인트 정의
// ============================================

export interface ApiEndpoints {
  // Auth
  "POST /api/auth/google": {
    request: GoogleAuthRequest;
    response: GoogleAuthResponse;
  };
  "GET /api/auth/me": {
    request: void;
    response: User;
  };

  // Subscriptions
  "GET /api/subscriptions/user/:userId": {
    request: void;
    response: Subscription;
  };
  "POST /api/subscriptions/:subscriptionId/cancel": {
    request: void;
    response: { cancelAtPeriodEnd: boolean; currentPeriodEnd: ISODateString };
  };

  // Credits
  "GET /api/credits/user/:userId": {
    request: void;
    response: Credits;
  };
  "POST /api/credits/use": {
    request: UseCreditsRequest;
    response: UseCreditsResponse;
  };

  // Batch Tokens
  "GET /api/batch-tokens/user/:userId": {
    request: void;
    response: BatchToken;
  };
  "POST /api/batch-tokens/use": {
    request: UseBatchTokenRequest;
    response: UseBatchTokenResponse;
  };
  "POST /api/batch-tokens/refill": {
    request: RefillBatchTokenRequest;
    response: RefillBatchTokenResponse;
  };

  // Schedules
  "GET /api/schedules/user/:userId": {
    request: void;
    response: Schedule[];
  };
  "POST /api/schedules": {
    request: CreateScheduleRequest;
    response: Schedule;
  };
  "PATCH /api/schedules/:id": {
    request: UpdateScheduleRequest;
    response: Schedule;
  };
  "DELETE /api/schedules/:id": {
    request: void;
    response: void;
  };
  "POST /api/schedules/:id/test": {
    request: void;
    response: TestScheduleResponse;
  };

  // Podcasts
  "GET /api/podcasts/user/:userId": {
    request: PodcastListParams;
    response: PodcastListResponse;
  };
  "POST /api/podcasts/generate": {
    request: GeneratePodcastRequest;
    response: GeneratePodcastResponse;
  };
  "GET /api/podcasts/:id": {
    request: void;
    response: Podcast;
  };
  "GET /api/podcasts/:id/status": {
    request: void;
    response: PodcastStatusResponse;
  };
  "POST /api/podcasts/:id/play": {
    request: void;
    response: { playCount: number };
  };

  // Payments
  "POST /api/payments/stripe/checkout": {
    request: StripeCheckoutRequest;
    response: StripeCheckoutResponse;
  };
  "POST /api/payments/toss/confirm": {
    request: TossConfirmRequest;
    response: TossConfirmResponse;
  };
  "GET /api/payments/history": {
    request: { userId: UUID };
    response: Payment[];
  };
}

// ============================================
// 검증 규칙
// ============================================

export const ValidationRules = {
  schedule: {
    prompt: {
      minLength: 10,
      maxLength: 500,
    },
    days: {
      minItems: 1,
      maxItems: 7,
    },
    time: {
      format: /^([01]\d|2[0-3]):([0-5]\d)$/,
    },
    email: {
      format: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    timezone: {
      allowed: [
        "Asia/Seoul",
        "America/New_York",
        "America/Los_Angeles",
        "Europe/London",
        "Europe/Paris",
        "Asia/Tokyo",
        "Asia/Shanghai",
      ],
    },
  },
  podcast: {
    prompt: {
      minLength: 5,
      maxLength: 500,
    },
  },
} as const;

// ============================================
// 플랜 정의
// ============================================

export const PLANS: Record<PlanType, Plan> = {
  free: {
    id: "free",
    name: "Free",
    price: { USD: 0, KRW: 0 },
    features: {
      schedulerEnabled: true,
      maxSchedules: 7, // 배치 토큰 개수와 동일
      premiumVoices: false,
      priorityCrawling: false,
      rssFeed: false,
      batchTokens: 7, // 수동 생성 7회 또는 스케줄러 7회 실행
      batchTokenValidityDays: 7,
    },
  },
  basic: {
    id: "basic",
    name: "Basic",
    price: { USD: 100, KRW: 1300 },
    stripePriceId: "price_basic_monthly",
    features: {
      schedulerEnabled: true,
      maxSchedules: 30, // 배치 토큰 개수와 동일
      premiumVoices: false,
      priorityCrawling: false,
      rssFeed: false,
      batchTokens: 30, // 수동 생성 30회 또는 스케줄러 30회 실행
      batchTokenValidityDays: 30,
    },
  },
  pro: {
    id: "pro",
    name: "Pro",
    price: { USD: 1000, KRW: 15000 },
    stripePriceId: "price_pro_monthly",
    features: {
      schedulerEnabled: true,
      maxSchedules: -1,
      premiumVoices: true,
      priorityCrawling: true,
      rssFeed: true,
      batchTokens: -1, // 무제한
      batchTokenValidityDays: -1,
    },
  },
};
