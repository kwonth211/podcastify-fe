# API 연동 설정 가이드

## 개요

프론트엔드는 Supabase Auth를 사용하여 인증하고, 백엔드 API (`https://api.dailynewspod.com/api/v2`)와 통신합니다.

## 환경 변수 설정

`.env` 파일에 다음 변수들을 설정하세요:

```env
# Supabase 설정 (필수)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# API Base URL
# 로컬 개발 환경(yarn dev)일 때는 자동으로 http://localhost:8000/api/v2 사용
# 프로덕션 빌드 시에만 이 값이 사용됩니다
# 개발 환경에서 다른 URL을 사용하려면 명시적으로 설정하세요
# VITE_API_URL=http://localhost:8000/api/v2
VITE_API_URL=https://api.dailynewspod.com/api/v2

# Google OAuth (Supabase에서 설정)
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# Payment
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
VITE_TOSS_CLIENT_KEY=test_ck_xxxxx
```

## Supabase 설정

1. **Supabase 프로젝트 생성**

   - [Supabase Dashboard](https://app.supabase.com)에서 새 프로젝트 생성

2. **Google OAuth 설정**

   - Supabase Dashboard → Authentication → Providers → Google
   - Google Cloud Console에서 OAuth 클라이언트 ID 생성
   - Supabase에 클라이언트 ID와 Secret 입력
   - Redirect URL: `https://your-project.supabase.co/auth/v1/callback`

3. **환경 변수 가져오기**
   - Supabase Dashboard → Settings → API
   - `Project URL` → `VITE_SUPABASE_URL`
   - `anon public` key → `VITE_SUPABASE_ANON_KEY`

## API 클라이언트 사용법

### 기본 사용

```typescript
import { apiGet, apiPost, apiPatch, apiDelete } from "../utils/apiClient";

// GET 요청
const response = await apiGet<User>("/users/me");
const user = response.data;

// POST 요청
const result = await apiPost<Schedule>("/schedules", {
  prompt: "AI 뉴스 요약",
  days: ["monday", "wednesday", "friday"],
  time: "08:00",
  email: "user@example.com",
});

// PATCH 요청
await apiPatch("/schedules/123", {
  is_active: false,
});

// DELETE 요청
await apiDelete("/schedules/123");
```

### 서비스 사용

```typescript
import { getSchedules, createSchedule } from "../services/scheduleService";
import { generatePodcast, pollPodcastStatus } from "../services/podcastService";
import { getSubscription } from "../services/subscriptionService";

// 스케줄 조회
const schedules = await getSchedules();

// 스케줄 생성
const schedule = await createSchedule({
  prompt: "AI 뉴스 요약",
  days: ["monday", "wednesday", "friday"],
  time: "08:00",
  email: "user@example.com",
});

// 팟캐스트 생성 및 상태 폴링
const { podcast_id } = await generatePodcast({
  prompt: "오늘 AI 뉴스",
});

const podcast = await pollPodcastStatus(podcast_id, (status) => {
  console.log(`진행률: ${status.progress}%`);
});
```

## 인증 플로우

1. **로그인**

   ```typescript
   import { signInWithGoogle } from "../utils/googleAuth";

   await signInWithGoogle();
   // Google OAuth 페이지로 리다이렉트
   ```

2. **콜백 처리**

   - `/auth/callback` 경로에서 자동 처리
   - `GoogleAuthCallback` 컴포넌트가 세션을 확인하고 홈으로 리다이렉트

3. **세션 확인**

   ```typescript
   import { isAuthenticated, getCurrentUser } from "../utils/googleAuth";

   const authenticated = await isAuthenticated();
   const user = await getCurrentUser();
   ```

4. **로그아웃**

   ```typescript
   import { signOut } from "../utils/googleAuth";

   await signOut();
   ```

## API 엔드포인트

모든 API 엔드포인트는 `BACKEND_SPEC.md`에 정의되어 있습니다.

주요 엔드포인트:

- `/auth/me` - 현재 사용자 정보
- `/users/me` - 사용자 프로필
- `/users/me/stats` - 사용자 통계
- `/subscriptions/plans` - 플랜 목록
- `/subscriptions/me` - 현재 구독 정보
- `/credits/me` - 크레딧 정보
- `/credits/batch-tokens/me` - 배치 토큰 정보
- `/schedules/me` - 스케줄 목록
- `/schedules` - 스케줄 생성
- `/schedules/{id}` - 스케줄 조회/수정/삭제
- `/schedules/{id}/toggle` - 스케줄 활성화 토글
- `/schedules/{id}/test` - 스케줄 테스트 실행
- `/podcasts/me` - 팟캐스트 목록
- `/podcasts/generate` - 팟캐스트 생성
- `/podcasts/{id}` - 팟캐스트 상세
- `/podcasts/{id}/status` - 팟캐스트 상태
- `/payments/stripe/checkout` - Stripe 결제 세션 생성
- `/payments/toss/confirm` - 토스 결제 승인
- `/payments/history` - 결제 내역

## 에러 처리

```typescript
import { apiGet, APIError } from "../utils/apiClient";

try {
  const response = await apiGet("/users/me");
} catch (error) {
  if (error instanceof APIError) {
    console.error(`에러 코드: ${error.code}`);
    console.error(`에러 메시지: ${error.message}`);

    if (error.code === "UNAUTHORIZED") {
      // 인증 필요 - 로그인 페이지로 리다이렉트
    }
  }
}
```

## 타입 정의

모든 API 타입은 `src/types/api.ts`에 정의되어 있습니다.

주요 타입:

- `User`, `UserStats`
- `Subscription`, `PlanFeatures`
- `Credits`, `BatchTokens`
- `Schedule`, `ScheduleCreate`, `ScheduleUpdate`
- `Podcast`, `PodcastDetail`, `PodcastStatusResponse`
- `Payment`, `StripeCheckoutResponse`, `TossConfirmResponse`

## 개발 팁

1. **로컬 개발**

   - 로컬 개발 환경(`yarn dev`)에서는 **자동으로** `http://localhost:8000/api/v2` 사용
   - 별도로 `VITE_API_URL` 설정 불필요
   - 백엔드 서버가 `http://localhost:8000`에서 실행 중이어야 함
   - 다른 포트를 사용하려면 `VITE_API_URL=http://localhost:포트번호/api/v2` 설정

2. **인증 토큰**

   - Supabase가 자동으로 Bearer Token을 관리
   - API 클라이언트가 자동으로 헤더에 추가

3. **CORS 설정**

   - 백엔드에서 프론트엔드 도메인을 허용해야 함

4. **환경 변수**
   - `.env` 파일은 Git에 커밋하지 않음
   - `.env.example`을 참고하여 설정
