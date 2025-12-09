import { useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import * as analytics from "../utils/analytics";

/**
 * 페이지뷰 자동 트래킹 훅
 * React Router의 location 변경을 감지하여 자동으로 페이지뷰를 트래킹합니다.
 */
export const usePageTracking = (): void => {
  const location = useLocation();

  useEffect(() => {
    // 페이지 경로와 제목을 전송
    analytics.pageview(location.pathname + location.search, document.title);
  }, [location]);
};

/**
 * 스크롤 깊이 트래킹 훅
 * 25%, 50%, 75%, 100% 스크롤 시점에서 이벤트를 발생시킵니다.
 */
export const useScrollDepthTracking = (): void => {
  const trackedDepths = useRef<Set<number>>(new Set());

  useEffect(() => {
    const handleScroll = (): void => {
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;

      const scrollPercentage = Math.round(
        (window.scrollY / scrollHeight) * 100
      );
      const thresholds = [25, 50, 75, 100];

      thresholds.forEach((threshold) => {
        if (
          scrollPercentage >= threshold &&
          !trackedDepths.current.has(threshold)
        ) {
          trackedDepths.current.add(threshold);
          analytics.trackScrollDepth(threshold);
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 페이지 변경 시 스크롤 깊이 초기화
  const location = useLocation();
  useEffect(() => {
    trackedDepths.current.clear();
  }, [location.pathname]);
};

/**
 * 체류 시간 트래킹 훅
 * 페이지 이탈 또는 일정 시간마다 체류 시간을 기록합니다.
 */
export const useTimeOnPageTracking = (intervalSeconds = 30): void => {
  const location = useLocation();
  const startTimeRef = useRef<number>(Date.now());
  const lastRecordedRef = useRef<number>(0);

  useEffect(() => {
    startTimeRef.current = Date.now();
    lastRecordedRef.current = 0;

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      if (elapsed > lastRecordedRef.current) {
        lastRecordedRef.current = elapsed;
        // 30초 간격으로만 트래킹 (매초 트래킹하면 과도한 이벤트 발생)
        if (elapsed % intervalSeconds === 0) {
          analytics.trackTimeOnPage(elapsed, location.pathname);
        }
      }
    }, 1000);

    const handleBeforeUnload = (): void => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      analytics.trackTimeOnPage(elapsed, location.pathname);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      clearInterval(interval);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      // 페이지 변경 시 체류 시간 기록
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      if (elapsed > 0) {
        analytics.trackTimeOnPage(elapsed, location.pathname);
      }
    };
  }, [location.pathname, intervalSeconds]);
};

/**
 * 팟캐스트 재생 트래킹 훅
 * 재생, 일시정지, 완료 등의 이벤트를 쉽게 트래킹할 수 있습니다.
 */
export const usePodcastTracking = () => {
  const trackPlay = useCallback(
    (podcastId: string, podcastTitle: string, duration?: number) => {
      analytics.trackPodcastPlay(podcastId, podcastTitle, duration);
    },
    []
  );

  const trackPause = useCallback(
    (podcastId: string, podcastTitle: string, currentTime?: number) => {
      analytics.trackPodcastPause(podcastId, podcastTitle, currentTime);
    },
    []
  );

  const trackComplete = useCallback(
    (podcastId: string, podcastTitle: string) => {
      analytics.trackPodcastComplete(podcastId, podcastTitle);
    },
    []
  );

  const trackSelect = useCallback((podcastId: string, podcastTitle: string) => {
    analytics.trackPodcastSelect(podcastId, podcastTitle);
  }, []);

  const trackSeek = useCallback(
    (podcastId: string, fromTime: number, toTime: number) => {
      analytics.trackPodcastSeek(podcastId, fromTime, toTime);
    },
    []
  );

  return {
    trackPlay,
    trackPause,
    trackComplete,
    trackSelect,
    trackSeek,
  };
};

/**
 * 외부 링크 클릭 트래킹 훅
 * 외부 링크 클릭 시 자동으로 트래킹합니다.
 */
export const useOutboundLinkTracking = (): void => {
  useEffect(() => {
    const handleClick = (e: MouseEvent): void => {
      const target = e.target as HTMLElement;
      const link = target.closest("a");

      if (link && link.href) {
        const url = new URL(link.href, window.location.href);
        // 외부 링크인 경우에만 트래킹
        if (url.hostname !== window.location.hostname) {
          analytics.trackOutboundLink(link.href);
        }
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);
};
