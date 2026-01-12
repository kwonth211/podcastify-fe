/// <reference types="vite/client" />

interface ImportMetaEnv {
  // 빌드 시에만 사용 (서버 사이드)
  readonly VITE_R2_ENDPOINT?: string;
  readonly VITE_R2_ACCESS_KEY_ID?: string; // 빌드용 - 클라이언트에서 사용하지 않음
  readonly VITE_R2_SECRET_ACCESS_KEY?: string; // 빌드용 - 클라이언트에서 사용하지 않음
  readonly VITE_R2_BUCKET_NAME?: string;
  
  // 런타임용 (클라이언트에서 사용)
  readonly VITE_R2_PUBLIC_URL?: string;
  
  // Google Analytics
  readonly VITE_GA_ID?: string;
  
  // Google OAuth
  readonly VITE_GOOGLE_CLIENT_ID?: string;
  
  // Supabase
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  
  // API Base URL
  readonly VITE_API_URL?: string;
  
  // Payment
  readonly VITE_STRIPE_PUBLISHABLE_KEY?: string;
  readonly VITE_TOSS_CLIENT_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Google Analytics 타입 정의
declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

