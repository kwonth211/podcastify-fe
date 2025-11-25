/// <reference types="vite/client" />

interface ImportMetaEnv {
  // 빌드 시에만 사용 (서버 사이드)
  readonly VITE_R2_ENDPOINT?: string;
  readonly VITE_R2_ACCESS_KEY_ID?: string; // 빌드용 - 클라이언트에서 사용하지 않음
  readonly VITE_R2_SECRET_ACCESS_KEY?: string; // 빌드용 - 클라이언트에서 사용하지 않음
  readonly VITE_R2_BUCKET_NAME?: string;
  
  // 런타임용 (클라이언트에서 사용)
  readonly VITE_R2_PUBLIC_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

