// Google Analytics 4 유틸리티
// GA4 Measurement ID를 환경 변수로 관리합니다

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

// GA4 Measurement ID
export const GA_MEASUREMENT_ID =
  import.meta.env.VITE_GA_MEASUREMENT_ID || "G-CW9BGYNXE2";

// GA4 초기화 확인
export const isGAInitialized = (): boolean => {
  return typeof window !== "undefined" && typeof window.gtag === "function";
};

// 페이지뷰 트래킹
export const pageview = (url: string, title?: string): void => {
  if (!isGAInitialized()) return;

  window.gtag("config", GA_MEASUREMENT_ID, {
    page_path: url,
    page_title: title,
  });
};

// 커스텀 이벤트 트래킹
export const event = (
  action: string,
  category: string,
  label?: string,
  value?: number,
  additionalParams?: Record<string, unknown>
): void => {
  if (!isGAInitialized()) return;

  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value: value,
    ...additionalParams,
  });
};

// ============================================
// 팟캐스트 관련 이벤트
// ============================================

// 팟캐스트 재생 시작
export const trackPodcastPlay = (
  podcastId: string,
  podcastTitle: string,
  duration?: number
): void => {
  event("play", "podcast", podcastTitle, undefined, {
    podcast_id: podcastId,
    podcast_title: podcastTitle,
    duration: duration,
  });
};

// 팟캐스트 일시정지
export const trackPodcastPause = (
  podcastId: string,
  podcastTitle: string,
  currentTime?: number
): void => {
  event("pause", "podcast", podcastTitle, undefined, {
    podcast_id: podcastId,
    podcast_title: podcastTitle,
    current_time: currentTime,
  });
};

// 팟캐스트 재생 완료
export const trackPodcastComplete = (
  podcastId: string,
  podcastTitle: string
): void => {
  event("complete", "podcast", podcastTitle, undefined, {
    podcast_id: podcastId,
    podcast_title: podcastTitle,
  });
};

// 팟캐스트 선택/클릭
export const trackPodcastSelect = (
  podcastId: string,
  podcastTitle: string
): void => {
  event("select_content", "podcast", podcastTitle, undefined, {
    content_type: "podcast",
    content_id: podcastId,
    podcast_title: podcastTitle,
  });
};

// 팟캐스트 탐색 (시크바)
export const trackPodcastSeek = (
  podcastId: string,
  fromTime: number,
  toTime: number
): void => {
  event("seek", "podcast", podcastId, undefined, {
    podcast_id: podcastId,
    from_time: fromTime,
    to_time: toTime,
  });
};

// ============================================
// UI 인터랙션 이벤트
// ============================================

// 버튼 클릭
export const trackButtonClick = (
  buttonName: string,
  location?: string
): void => {
  event("click", "button", buttonName, undefined, {
    button_name: buttonName,
    location: location,
  });
};

// 링크 클릭 (외부 링크)
export const trackOutboundLink = (url: string): void => {
  event("click", "outbound_link", url, undefined, {
    link_url: url,
  });
};

// 검색
export const trackSearch = (searchTerm: string): void => {
  event("search", "engagement", searchTerm, undefined, {
    search_term: searchTerm,
  });
};

// 필터 사용
export const trackFilter = (filterType: string, filterValue: string): void => {
  event("filter", "engagement", filterType, undefined, {
    filter_type: filterType,
    filter_value: filterValue,
  });
};

// ============================================
// PWA 관련 이벤트
// ============================================

// 설치 프롬프트 표시
export const trackInstallPromptShown = (): void => {
  event("install_prompt_shown", "pwa");
};

// 설치 버튼 클릭
export const trackInstallClick = (): void => {
  event("install_click", "pwa");
};

// 앱 설치 완료
export const trackInstallComplete = (): void => {
  event("install_complete", "pwa");
};

// 설치 프롬프트 닫기
export const trackInstallDismiss = (): void => {
  event("install_dismiss", "pwa");
};

// ============================================
// 스크롤 및 참여도 이벤트
// ============================================

// 스크롤 깊이
export const trackScrollDepth = (percentage: number): void => {
  event("scroll", "engagement", `${percentage}%`, percentage, {
    percent_scrolled: percentage,
  });
};

// 체류 시간 (초 단위)
export const trackTimeOnPage = (seconds: number, pagePath: string): void => {
  event("time_on_page", "engagement", pagePath, seconds, {
    page_path: pagePath,
    time_seconds: seconds,
  });
};

// ============================================
// 트랜스크립트 관련 이벤트
// ============================================

// 트랜스크립트 페이지 열람
export const trackTranscriptView = (
  podcastId: string,
  podcastTitle: string
): void => {
  event("view_transcript", "engagement", podcastTitle, undefined, {
    podcast_id: podcastId,
    podcast_title: podcastTitle,
  });
};

// 트랜스크립트 내 특정 구간 클릭
export const trackTranscriptSegmentClick = (
  podcastId: string,
  timestamp: number
): void => {
  event("transcript_segment_click", "engagement", podcastId, undefined, {
    podcast_id: podcastId,
    timestamp: timestamp,
  });
};

// ============================================
// 공유 이벤트
// ============================================

// 공유 버튼 클릭
export const trackShare = (
  contentType: string,
  contentId: string,
  method?: string
): void => {
  event("share", "social", contentId, undefined, {
    content_type: contentType,
    content_id: contentId,
    method: method,
  });
};

// ============================================
// 에러 트래킹
// ============================================

// 에러 발생
export const trackError = (
  errorType: string,
  errorMessage: string,
  errorLocation?: string
): void => {
  event("error", "error", errorType, undefined, {
    error_type: errorType,
    error_message: errorMessage,
    error_location: errorLocation,
  });
};

// 오디오 로드 실패
export const trackAudioError = (
  podcastId: string,
  errorMessage: string
): void => {
  event("audio_error", "error", podcastId, undefined, {
    podcast_id: podcastId,
    error_message: errorMessage,
  });
};
