import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import styled from "styled-components";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { listAudioFiles, getAudioUrl } from "../utils/r2Client";
import { usePlayer } from "../contexts/PlayerContext";
import Footer from "./Footer";
import Timeline from "./Timeline";
import type { PodcastFile } from "../types";
import * as analytics from "../utils/analytics";

function PodcastList() {
  const { t, i18n } = useTranslation();
  const { playPodcast, playerState } = usePlayer();
  const [podcasts, setPodcasts] = useState<PodcastFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPodcast, setSelectedPodcast] = useState<PodcastFile | null>(
    null
  );
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [, setInitialSeekTime] = useState<number | undefined>(undefined);

  // 배너 스와이프 관련
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const isDragging = useRef<boolean>(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const bannerContainerRef = useRef<HTMLDivElement>(null);

  // 과거 뉴스 섹션 펼침/접힘 상태
  const [isPastExpanded, setIsPastExpanded] = useState(false);

  // 오늘 첫 방문 여부
  const [isFirstVisitToday, setIsFirstVisitToday] = useState(false);

  // 타임라인 프리뷰 데이터
  const [timelinePreviews, setTimelinePreviews] = useState<
    Record<string, { time: number; label: string }[]>
  >({});

  // 배너 이미지 로드 상태
  const [loadedBanners, setLoadedBanners] = useState<Record<number, boolean>>(
    {}
  );

  useEffect(() => {
    loadPodcasts();
  }, []);

  // 오늘 첫 방문 체크
  useEffect(() => {
    const today = dayjs().format("YYYY-MM-DD");
    const visitedKey = `visited_${today}`;
    const hasVisitedToday = localStorage.getItem(visitedKey);

    if (!hasVisitedToday) {
      setIsFirstVisitToday(true);
      // 5초 후에 방문 기록 저장 (애니메이션 시청 후)
      const timer = setTimeout(() => {
        localStorage.setItem(visitedKey, "true");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  // URL에서 playerId 읽어서 선택 및 스크롤
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const playerId = urlParams.get("playerId");

    if (playerId && podcasts.length > 0) {
      selectPodcastByKey(playerId);
    }
  }, [podcasts]); // selectedPodcast 의존성 제거 (무한 루프 방지)

  // 배너 자동 슬라이드
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % 3);
    }, 4000); // 4초마다 슬라이드

    return () => clearInterval(interval);
  }, [currentBannerIndex]); // currentBannerIndex가 변경되면 타이머 재시작

  // 배너 컨테이너 너비 가져오기
  const getContainerWidth = () => {
    return bannerContainerRef.current?.offsetWidth || window.innerWidth;
  };

  // 드래그 종료 처리 공통 함수
  const handleDragEnd = () => {
    const diffX = touchStartX.current - touchEndX.current;
    const containerWidth = getContainerWidth();
    const threshold = containerWidth * 0.2; // 20% 이상 드래그하면 넘김

    setIsTransitioning(true);
    setDragOffset(0);

    if (Math.abs(diffX) > threshold) {
      if (diffX > 0) {
        // 왼쪽으로 스와이프 -> 다음 배너
        setCurrentBannerIndex((prev) => (prev + 1) % 3);
      } else {
        // 오른쪽으로 스와이프 -> 이전 배너
        setCurrentBannerIndex((prev) => (prev - 1 + 3) % 3);
      }
    }
  };

  // 배너 스와이프 핸들러 (모바일 터치)
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsTransitioning(false);
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
    const diffX = touchStartX.current - touchEndX.current;
    const containerWidth = getContainerWidth();
    // 드래그 거리를 퍼센트로 변환 (약간의 저항감 추가)
    const offsetPercent = (diffX / containerWidth) * 100 * 0.8;
    setDragOffset(offsetPercent);
  };

  const handleTouchEnd = () => {
    handleDragEnd();
  };

  // 배너 드래그 핸들러 (데스크탑 마우스)
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    setIsTransitioning(false);
    touchStartX.current = e.clientX;
    touchEndX.current = e.clientX;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging.current) {
      touchEndX.current = e.clientX;
      const diffX = touchStartX.current - touchEndX.current;
      const containerWidth = getContainerWidth();
      const offsetPercent = (diffX / containerWidth) * 100 * 0.8;
      setDragOffset(offsetPercent);
    }
  };

  const handleMouseUp = () => {
    if (isDragging.current) {
      isDragging.current = false;
      handleDragEnd();
    }
  };

  const handleMouseLeave = () => {
    if (isDragging.current) {
      isDragging.current = false;
      handleDragEnd();
    }
  };

  const loadPodcasts = async () => {
    try {
      setLoading(true);
      setError(null);
      const files = await listAudioFiles();
      setPodcasts(files);

      // 목록을 먼저 표시하기 위해 로딩 상태를 해제
      setLoading(false);

      // 각 팟캐스트의 duration, 재생 횟수, 타임라인을 백그라운드에서 병렬로 로드
      Promise.all([
        loadDurations(files),
        loadPlayCounts(files),
        loadTimelinePreviews(files),
      ]).catch((err) => {
        console.warn("백그라운드 데이터 로드 중 오류:", err);
      });
    } catch (err) {
      setError(t("podcast.loadError"));
      console.error(err);
      setLoading(false);
    }
  };

  // 타임라인 프리뷰 로드
  const loadTimelinePreviews = async (files: PodcastFile[]) => {
    const publicUrl = import.meta.env.VITE_R2_PUBLIC_URL;
    if (!publicUrl) return;

    // 타임라인 텍스트 파싱
    const parseTimeline = (text: string): { time: number; label: string }[] => {
      const lines = text.split("\n");
      const items: { time: number; label: string }[] = [];

      for (const line of lines) {
        const match = line.match(/^\[(\d{1,2}):(\d{2})\]\s*(.+)$/);
        if (match) {
          const minutes = parseInt(match[1], 10);
          const seconds = parseInt(match[2], 10);
          const label = match[3].trim();
          items.push({
            time: minutes * 60 + seconds,
            label,
          });
        }
      }
      return items;
    };

    await Promise.all(
      files.map(async (file) => {
        try {
          const timelineKey = file.key
            .replace("_podcast_", "_timeline_")
            .replace(".mp3", ".txt");
          const timelineUrl = `${publicUrl}/${timelineKey}`;

          const response = await fetch(timelineUrl);
          if (!response.ok) return;

          const text = await response.text();
          const items = parseTimeline(text);

          if (items.length > 0) {
            setTimelinePreviews((prev) => ({
              ...prev,
              [file.key]: items, // 전체 타임라인 저장
            }));
          }
        } catch {
          // 타임라인 없는 경우 무시
        }
      })
    );
  };

  const loadDurations = async (files: PodcastFile[]) => {
    // 병렬로 duration 로드 (최대 5개씩)
    const batchSize = 5;
    for (let i = 0; i < files.length; i += batchSize) {
      const batch = files.slice(i, i + batchSize);
      await Promise.all(
        batch.map(async (file) => {
          try {
            const url = await getAudioUrl(file.key);
            const audio = new Audio(url);

            await new Promise<void>((resolve, reject) => {
              const timeout = setTimeout(() => {
                reject(new Error("Timeout"));
              }, 5000);

              audio.addEventListener(
                "loadedmetadata",
                () => {
                  clearTimeout(timeout);
                  const duration = audio.duration;
                  if (duration && !isNaN(duration)) {
                    setPodcasts((prev) =>
                      prev.map((p) =>
                        p.key === file.key ? { ...p, duration } : p
                      )
                    );
                  }
                  resolve();
                },
                { once: true }
              );

              audio.addEventListener("error", () => {
                clearTimeout(timeout);
                reject(new Error("Failed to load audio"));
              });

              audio.load();
            });
          } catch (err) {
            // duration 로드 실패는 무시 (추정값 사용)
            console.warn(`Failed to load duration for ${file.key}:`, err);
          }
        })
      );
    }
  };

  // 조회수 관련 공통 함수들
  const updatePlayCountState = (key: string, count: number) => {
    setPodcasts((prev) =>
      prev.map((p) => (p.key === key ? { ...p, playCount: count } : p))
    );
    setSelectedPodcast((prev) =>
      prev && prev.key === key ? { ...prev, playCount: count } : prev
    );
  };

  const fetchPlayCount = async (key: string): Promise<number | null> => {
    try {
      const response = await fetch(`/api/count?key=${encodeURIComponent(key)}`);
      const data = await response.json();
      if (data.count !== undefined) {
        updatePlayCountState(key, data.count);
        return data.count;
      }
    } catch (err) {
      console.warn(`조회수 가져오기 실패 (${key}):`, err);
    }
    return null;
  };

  const loadPlayCounts = async (files: PodcastFile[]) => {
    // 각 팟캐스트의 재생 횟수 로드
    await Promise.all(files.map((file) => fetchPlayCount(file.key)));
  };

  // duration이 없으면 가져오기
  const ensureDuration = async (podcast: PodcastFile, audioUrl: string) => {
    if (podcast.duration) return; // 이미 있으면 스킵

    try {
      const audio = new Audio(audioUrl);
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error("Timeout")), 5000);
        audio.addEventListener(
          "loadedmetadata",
          () => {
            clearTimeout(timeout);
            const duration = audio.duration;
            if (duration && !isNaN(duration)) {
              setPodcasts((prev) =>
                prev.map((p) =>
                  p.key === podcast.key ? { ...p, duration } : p
                )
              );
              setSelectedPodcast((prev) =>
                prev && prev.key === podcast.key ? { ...prev, duration } : prev
              );
            }
            resolve();
          },
          { once: true }
        );
        audio.addEventListener("error", () => {
          clearTimeout(timeout);
          reject(new Error("Failed to load audio"));
        });
        audio.load();
      });
    } catch (err) {
      console.warn(`Duration 로드 실패 (${podcast.key}):`, err);
    }
  };

  // key로 팟캐스트 선택 (URL 변경 시 사용)
  const selectPodcastByKey = async (key: string) => {
    const podcast = podcasts.find((p) => p.key === key);
    if (!podcast) return;

    // 이미 선택된 것과 같으면 스킵
    if (selectedPodcast?.key === key) return;

    setSelectedPodcast(podcast);
    const newAudioUrl = await getAudioUrl(podcast.key);
    setAudioUrl(newAudioUrl);

    // 전역 플레이어에 재생 요청
    playPodcast(podcast.key, newAudioUrl, formatMiniDate(podcast.date));

    // 과거 뉴스인 경우 자동으로 섹션 펼치기
    if (!isToday(podcast.date)) {
      setIsPastExpanded(true);
    }

    // duration이 없으면 가져오기
    await ensureDuration(podcast, newAudioUrl);

    // 스크롤
    setTimeout(() => {
      const element = document.getElementById(`podcast-${key}`);
      if (element) {
        const elementRect = element.getBoundingClientRect();
        const absoluteElementTop = elementRect.top + window.pageYOffset;
        const middle =
          absoluteElementTop - window.innerHeight / 2 + elementRect.height / 2;
        window.scrollTo({
          top: middle,
          behavior: "smooth",
        });
      }
    }, 200);
  };

  const handlePodcastClick = async (podcast: PodcastFile) => {
    try {
      // GA 이벤트: 팟캐스트 선택
      analytics.trackPodcastSelect(
        podcast.key,
        `${formatShortDate(podcast.date)} 뉴스`
      );

      // URL 업데이트
      const url = new URL(window.location.href);
      url.searchParams.set("playerId", podcast.key);
      window.history.pushState({}, "", url.toString());

      setSelectedPodcast(podcast);
      setInitialSeekTime(undefined); // 일반 클릭시 처음부터 재생
      const newAudioUrl = await getAudioUrl(podcast.key);
      setAudioUrl(newAudioUrl);

      // 전역 플레이어에 재생 요청
      playPodcast(podcast.key, newAudioUrl, formatMiniDate(podcast.date));

      // 과거 뉴스 클릭 시 자동으로 섹션 펼치기
      if (!isToday(podcast.date)) {
        setIsPastExpanded(true);
      }

      // duration이 없으면 가져오기
      await ensureDuration(podcast, newAudioUrl);
    } catch (err) {
      setError(t("podcast.audioLoadError"));
      console.error(err);
      // GA 이벤트: 에러 트래킹
      analytics.trackError("audio_load", String(err), "PodcastList");
    }
  };

  // 타임라인 항목 클릭 핸들러
  const handleTimelineItemClick = async (
    e: React.MouseEvent,
    podcast: PodcastFile,
    seekTime: number
  ) => {
    e.stopPropagation(); // 부모의 팟캐스트 클릭 이벤트 방지

    // GA 이벤트: 타임라인 세그먼트 클릭
    analytics.trackTranscriptSegmentClick(podcast.key, seekTime);

    try {
      // 이미 선택된 팟캐스트인 경우 시간만 변경
      if (selectedPodcast?.key === podcast.key && audioUrl) {
        setInitialSeekTime(seekTime);
        // 전역 플레이어에 시간 업데이트
        playPodcast(
          podcast.key,
          audioUrl,
          formatMiniDate(podcast.date),
          seekTime
        );
        return;
      }

      // 새로운 팟캐스트 선택
      const url = new URL(window.location.href);
      url.searchParams.set("playerId", podcast.key);
      window.history.pushState({}, "", url.toString());

      setSelectedPodcast(podcast);
      const newAudioUrl = await getAudioUrl(podcast.key);
      setAudioUrl(newAudioUrl);
      setInitialSeekTime(seekTime);

      // 전역 플레이어에 재생 요청
      playPodcast(
        podcast.key,
        newAudioUrl,
        formatMiniDate(podcast.date),
        seekTime
      );

      // 과거 뉴스 클릭 시 자동으로 섹션 펼치기
      if (!isToday(podcast.date)) {
        setIsPastExpanded(true);
      }

      // duration이 없으면 가져오기
      await ensureDuration(podcast, newAudioUrl);
    } catch (err) {
      setError(t("podcast.audioLoadError"));
      console.error(err);
    }
  };

  // URL 변경 감지 (뒤로가기/앞으로가기)
  useEffect(() => {
    const handlePopState = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const playerId = urlParams.get("playerId");

      if (playerId && podcasts.length > 0) {
        selectPodcastByKey(playerId);
      } else {
        setSelectedPodcast(null);
        setAudioUrl(null);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [podcasts]);

  const formatShortDate = (dateString: string): string => {
    const format = i18n.language === "ko" ? "YYYY년 M월 D일" : "MMMM D, YYYY";
    return dayjs(dateString, "YYYY-MM-DD").format(format);
  };

  // MiniPlayer용 짧은 날짜 형식
  const formatMiniDate = (dateString: string): string => {
    const format = i18n.language === "ko" ? "M월D일" : "MMM D";
    return dayjs(dateString, "YYYY-MM-DD").format(format);
  };

  const formatRelativeTime = (date: string): string => {
    const targetDate = dayjs(date, "YYYY-MM-DD");
    if (!targetDate.isValid()) return "";

    const today = dayjs().startOf("day");
    const target = targetDate.startOf("day");
    const days = today.diff(target, "day");

    if (days === 0) return t("common.today");
    if (days === 1) return t("common.yesterday");
    if (days < 7) return t("common.daysAgo", { count: days });
    if (days < 30) return t("common.weeksAgo", { count: Math.floor(days / 7) });
    if (days < 365)
      return t("common.monthsAgo", { count: Math.floor(days / 30) });
    return t("common.yearsAgo", { count: Math.floor(days / 365) });
  };

  const formatDuration = (seconds?: number): string => {
    if (!seconds || isNaN(seconds)) return "";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatCount = (count: number | undefined): string => {
    if (count === undefined || count === null) return "—";
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toLocaleString();
  };

  const isToday = (dateString: string): boolean => {
    const today = dayjs().format("YYYY-MM-DD");
    const target = dayjs(dateString, "YYYY-MM-DD").format("YYYY-MM-DD");
    return today === target;
  };

  if (loading) {
    return (
      <Container>
        <LoadingContainer>
          <LoadingSpinner />
          <LoadingText>{t("common.loading")}</LoadingText>
        </LoadingContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Helmet>
        <html lang={i18n.language} />
        <title>{t("seo.title")}</title>
        <meta name="description" content={t("seo.description")} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dailynewspod.com/" />
        <meta property="og:title" content={t("seo.title")} />
        <meta property="og:description" content={t("seo.description")} />
        <meta property="og:image" content="https://dailynewspod.com/a.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta
          property="og:locale"
          content={i18n.language === "ko" ? "ko_KR" : "en_US"}
        />
        <meta property="og:site_name" content="Daily News Podcast" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://dailynewspod.com/" />
        <meta property="twitter:title" content={t("seo.title")} />
        <meta property="twitter:description" content={t("seo.description")} />
        <meta
          property="twitter:image"
          content="https://dailynewspod.com/a.png"
        />
      </Helmet>
      <Header>
        <Title onClick={() => (window.location.href = "/")}>
          Daily News Podcast
        </Title>
      </Header>

      {/* 이미지 배너 슬라이더 */}
      <ImageBannerContainer
        ref={bannerContainerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <BannerArrow
          $direction="left"
          onClick={() => {
            setCurrentBannerIndex((prev) => (prev - 1 + 3) % 3);
          }}
        >
          ‹
        </BannerArrow>
        <BannerSlider
          style={{
            transform: `translateX(calc(-${
              currentBannerIndex * 100
            }% - ${dragOffset}%))`,
            transition: isTransitioning ? "transform 0.3s ease-out" : "none",
          }}
        >
          <BannerSlide>
            <BannerImage
              src="/a.png"
              alt="Banner 1"
              loading="eager"
              fetchPriority="high"
              decoding="async"
              $loaded={loadedBanners[0]}
              onLoad={() =>
                setLoadedBanners((prev) => ({ ...prev, [0]: true }))
              }
            />
          </BannerSlide>
          <BannerSlide>
            <BannerImage
              src="/b.png"
              alt="Banner 2"
              loading="lazy"
              decoding="async"
              $loaded={loadedBanners[1]}
              onLoad={() =>
                setLoadedBanners((prev) => ({ ...prev, [1]: true }))
              }
            />
          </BannerSlide>
          <BannerSlide>
            <BannerImage
              src="/c.png"
              alt="Banner 3"
              loading="lazy"
              decoding="async"
              $loaded={loadedBanners[2]}
              onLoad={() =>
                setLoadedBanners((prev) => ({ ...prev, [2]: true }))
              }
            />
          </BannerSlide>
        </BannerSlider>
        <BannerArrow
          $direction="right"
          onClick={() => {
            setCurrentBannerIndex((prev) => (prev + 1) % 3);
          }}
        >
          ›
        </BannerArrow>
        <BannerDots>
          {[0, 1, 2].map((index) => (
            <BannerDot
              key={index}
              $active={index === currentBannerIndex}
              onClick={() => setCurrentBannerIndex(index)}
            />
          ))}
        </BannerDots>
      </ImageBannerContainer>

      {/* 강렬한 CTA 배너 */}
      {(() => {
        const todayPodcasts = podcasts.filter((p) => isToday(p.date));
        const hasToday = todayPodcasts.length > 0;
        const firstTodayPodcast = todayPodcasts[0];

        const handleBannerClick = async () => {
          // GA 이벤트: CTA 배너 클릭
          analytics.trackButtonClick("hero_banner_cta", "hero_section");

          // 첫 방문 상태 해제 및 방문 기록 저장
          if (isFirstVisitToday) {
            setIsFirstVisitToday(false);
            const today = dayjs().format("YYYY-MM-DD");
            localStorage.setItem(`visited_${today}`, "true");
          }

          if (hasToday && firstTodayPodcast) {
            // 이미 선택된 팟캐스트면 아무것도 하지 않음 (미니 플레이어에서 재생 중)
            if (selectedPodcast?.key === firstTodayPodcast.key && audioUrl) {
              return;
            }
            // 새로운 팟캐스트이므로 URL 업데이트와 함께 처리
            handlePodcastClick(firstTodayPodcast);
          }
        };

        return (
          <HeroBanner
            onClick={handleBannerClick}
            $isFirstVisit={isFirstVisitToday && hasToday}
          >
            <HeroContent>
              <HeroIcon>{hasToday ? "🎯" : "🎙️"}</HeroIcon>
              <HeroTextContainer>
                <HeroTitle>
                  {hasToday ? t("hero.titleToday") : t("hero.titleDefault")}
                </HeroTitle>
                <HeroSubtitle>
                  {hasToday
                    ? t("hero.subtitleToday")
                    : t("hero.subtitleDefault")}
                </HeroSubtitle>
                <HeroNotice>
                  <HeroNoticeIcon>🤖</HeroNoticeIcon>
                  <HeroNoticeText>{t("hero.notice")}</HeroNoticeText>
                </HeroNotice>
              </HeroTextContainer>
              <HeroArrow>→</HeroArrow>
            </HeroContent>
          </HeroBanner>
        );
      })()}

      {error && <ErrorContainer>{error}</ErrorContainer>}

      {podcasts.length === 0 ? (
        <EmptyState>
          <EmptyIcon>🎙️</EmptyIcon>
          <EmptyText>{t("podcast.noPodcasts")}</EmptyText>
        </EmptyState>
      ) : (
        <>
          {/* 오늘의 뉴스 섹션 */}
          {(() => {
            const todayPodcasts = podcasts.filter((p) => isToday(p.date));

            if (todayPodcasts.length > 0) {
              return (
                <TodaySection>
                  <TodaySectionHeader>
                    <TodaySectionTitle>
                      <TodayIcon>📰</TodayIcon>
                      {t("podcast.todayNews")}
                    </TodaySectionTitle>
                  </TodaySectionHeader>
                  <TodayListContainer>
                    {todayPodcasts.map((podcast, index) => {
                      const isSelected = selectedPodcast?.key === podcast.key;
                      const isNew = isToday(podcast.date);

                      return (
                        <PodcastItem
                          key={podcast.key}
                          id={`podcast-${podcast.key}`}
                          onClick={() => handlePodcastClick(podcast)}
                          style={{ animationDelay: `${index * 0.05}s` }}
                          $isNew={isNew}
                          $isSelected={isSelected}
                        >
                          {isNew && (
                            <NewBadge>
                              <NewBadgeText>{t("podcast.new")}</NewBadgeText>
                            </NewBadge>
                          )}
                          <ItemContent>
                            <ItemHeader>
                              <ItemInfo>
                                <ItemDate>
                                  {formatShortDate(podcast.date)}
                                </ItemDate>
                                <ItemMeta>
                                  <ItemTime>
                                    {formatRelativeTime(podcast.date)}
                                  </ItemTime>
                                  <PlayCountBadge>
                                    <PlayCountIcon>▶</PlayCountIcon>
                                    <PlayCountText>
                                      {t("podcast.playCount")}:{" "}
                                      {formatCount(podcast.playCount || 0)}
                                    </PlayCountText>
                                  </PlayCountBadge>
                                  {podcast.duration &&
                                    podcast.duration <= 180 && (
                                      <QuickBadge>
                                        <BadgeIcon>⏱️</BadgeIcon>
                                        <BadgeText>
                                          {t("podcast.quickSummary")}
                                        </BadgeText>
                                      </QuickBadge>
                                    )}
                                </ItemMeta>
                              </ItemInfo>
                              <PlayIndicator>
                                <PlayIcon>▶</PlayIcon>
                              </PlayIndicator>
                            </ItemHeader>

                            <ItemActions>
                              {podcast.duration && (
                                <DetailCard>
                                  <DetailIcon>⏱️</DetailIcon>
                                  <DetailContent>
                                    <DetailLabel>
                                      {t("podcast.playTime")}
                                    </DetailLabel>
                                    <DetailValue>
                                      {formatDuration(podcast.duration)}
                                    </DetailValue>
                                  </DetailContent>
                                </DetailCard>
                              )}
                              <TranscriptLink
                                to={`/transcript/${encodeURIComponent(
                                  podcast.key
                                )}`}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <TranscriptIcon>📄</TranscriptIcon>
                                <TranscriptText>
                                  {t("podcast.transcript")}
                                </TranscriptText>
                              </TranscriptLink>
                            </ItemActions>

                            {/* 타임라인 - 공통 컴포넌트 사용 */}
                            {timelinePreviews[podcast.key] &&
                              timelinePreviews[podcast.key].length > 0 && (
                                <Timeline
                                  items={timelinePreviews[podcast.key]}
                                  currentTime={
                                    playerState.podcastKey === podcast.key
                                      ? playerState.currentTime
                                      : 0
                                  }
                                  onTimeClick={(time) =>
                                    handleTimelineItemClick(
                                      {
                                        stopPropagation: () => {},
                                      } as React.MouseEvent,
                                      podcast,
                                      time
                                    )
                                  }
                                  variant="compact"
                                  maxHeight="280px"
                                  maxItems={3}
                                  isExpanded={isSelected}
                                  showActiveIndicator={
                                    playerState.podcastKey === podcast.key
                                  }
                                />
                              )}
                          </ItemContent>
                        </PodcastItem>
                      );
                    })}
                  </TodayListContainer>
                </TodaySection>
              );
            }
            return null;
          })()}

          {/* 과거 뉴스 섹션 */}
          {(() => {
            const pastPodcasts = podcasts.filter((p) => !isToday(p.date));

            if (pastPodcasts.length > 0) {
              return (
                <PastSection>
                  <PastSectionHeader
                    onClick={() => setIsPastExpanded(!isPastExpanded)}
                    $clickable
                  >
                    <PastSectionTitleWrapper>
                      <PastSectionIcon>📚</PastSectionIcon>
                      <PastSectionTitle>
                        {t("podcast.pastNews")}
                      </PastSectionTitle>
                      <PastSectionCount>
                        {t("podcast.count", { count: pastPodcasts.length })}
                      </PastSectionCount>
                    </PastSectionTitleWrapper>
                    <PastSectionToggle $expanded={isPastExpanded}>
                      <ToggleIcon>{isPastExpanded ? "▼" : "▶"}</ToggleIcon>
                      <ToggleText>
                        {isPastExpanded
                          ? t("podcast.collapse")
                          : t("podcast.expand")}
                      </ToggleText>
                    </PastSectionToggle>
                  </PastSectionHeader>
                  <PastListWrapper $expanded={isPastExpanded}>
                    <PastListContainer>
                      {pastPodcasts.map((podcast, index) => {
                        const isSelected = selectedPodcast?.key === podcast.key;
                        const hasTimeline =
                          timelinePreviews[podcast.key] &&
                          timelinePreviews[podcast.key].length > 0;

                        return (
                          <PastPodcastItem
                            key={podcast.key}
                            onClick={() => handlePodcastClick(podcast)}
                            style={{ animationDelay: `${index * 0.03}s` }}
                            $isSelected={isSelected}
                          >
                            <PastItemContent>
                              <PastItemInfo>
                                <PastItemDate>
                                  {formatShortDate(podcast.date)}
                                </PastItemDate>
                                <PastItemMeta>
                                  <PastItemTime>
                                    {formatRelativeTime(podcast.date)}
                                  </PastItemTime>
                                  {podcast.duration && (
                                    <PastItemDuration>
                                      {formatDuration(podcast.duration)}
                                    </PastItemDuration>
                                  )}
                                  <PastItemPlayCount>
                                    ▶ {formatCount(podcast.playCount || 0)}
                                  </PastItemPlayCount>
                                  {hasTimeline && !isSelected && (
                                    <PastTimelineBadge>
                                      {t("podcast.timeline")}
                                    </PastTimelineBadge>
                                  )}
                                  <PastTranscriptLink
                                    to={`/transcript/${encodeURIComponent(
                                      podcast.key
                                    )}`}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    📄 {t("transcript.title")}
                                  </PastTranscriptLink>
                                </PastItemMeta>
                              </PastItemInfo>
                              <PastPlayIndicator>▶</PastPlayIndicator>
                            </PastItemContent>

                            {/* 선택된 경우 타임라인 펼침 - 공통 컴포넌트 사용 */}
                            {isSelected && hasTimeline && (
                              <Timeline
                                items={timelinePreviews[podcast.key]}
                                currentTime={
                                  playerState.podcastKey === podcast.key
                                    ? playerState.currentTime
                                    : 0
                                }
                                onTimeClick={(time) =>
                                  handleTimelineItemClick(
                                    {
                                      stopPropagation: () => {},
                                    } as React.MouseEvent,
                                    podcast,
                                    time
                                  )
                                }
                                variant="compact"
                                maxHeight="280px"
                                isExpanded={true}
                              />
                            )}
                          </PastPodcastItem>
                        );
                      })}
                    </PastListContainer>
                  </PastListWrapper>
                </PastSection>
              );
            }
            return null;
          })()}
        </>
      )}

      {/* Footer */}
      <Footer />
    </Container>
  );
}

export default PodcastList;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 2rem;
  min-height: 100vh;
  background: linear-gradient(to bottom, #f8f9fa 0%, #ffffff 100%);

  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
  }
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    margin-bottom: 0.75rem;
  }
`;

const Title = styled.h1`
  display: inline-block;
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
  line-height: 1.2;
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.8;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 6rem 2rem;
  gap: 1.5rem;
`;

const LoadingSpinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid #e5e7eb;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.p`
  color: #6b7280;
  font-size: 1rem;
  font-weight: 500;
`;

const ErrorContainer = styled.div`
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  color: #991b1b;
  padding: 1.25rem 1.5rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  text-align: center;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(220, 38, 38, 0.1);
  border: 1px solid rgba(220, 38, 38, 0.1);
`;

const HeroBanner = styled.div<{ $isFirstVisit?: boolean }>`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  border-radius: 20px;
  padding: 2rem 2.5rem;
  margin-bottom: 2rem;
  box-shadow: ${(props) =>
    props.$isFirstVisit
      ? "0 8px 32px rgba(102, 126, 234, 0.5), 0 4px 16px rgba(102, 126, 234, 0.4), 0 0 0 4px rgba(102, 126, 234, 0.3)"
      : "0 8px 32px rgba(102, 126, 234, 0.3), 0 4px 16px rgba(102, 126, 234, 0.2)"};
  border: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  ${(props) =>
    props.$isFirstVisit &&
    `
    animation: heroPulse 2s ease-in-out infinite, heroGlow 1.5s ease-in-out infinite alternate;
  `}

  @keyframes heroPulse {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.02);
    }
  }

  @keyframes heroGlow {
    0% {
      box-shadow: 0 8px 32px rgba(102, 126, 234, 0.5),
        0 4px 16px rgba(102, 126, 234, 0.4), 0 0 0 4px rgba(102, 126, 234, 0.3);
    }
    100% {
      box-shadow: 0 12px 48px rgba(102, 126, 234, 0.7),
        0 6px 24px rgba(102, 126, 234, 0.5), 0 0 0 8px rgba(240, 147, 251, 0.4);
    }
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.1) 0%,
      rgba(255, 255, 255, 0) 100%
    );
    pointer-events: none;
  }

  &::after {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      45deg,
      transparent 30%,
      rgba(255, 255, 255, 0.3) 50%,
      transparent 70%
    );
    transform: translateX(-100%);
    pointer-events: none;
    ${(props) =>
      props.$isFirstVisit &&
      `
      animation: heroShine 3s ease-in-out infinite;
    `}
  }

  @keyframes heroShine {
    0% {
      transform: translateX(-100%);
    }
    50%,
    100% {
      transform: translateX(100%);
    }
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(102, 126, 234, 0.4),
      0 6px 20px rgba(102, 126, 234, 0.3);
    animation: none;
  }

  &:active {
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    padding: 1.5rem 1.75rem;
  }
`;

const HeroContent = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const HeroIcon = styled.div`
  font-size: 3rem;
  line-height: 1;
  animation: pulse 2s ease-in-out infinite;

  @keyframes pulse {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
  }

  @media (max-width: 768px) {
    font-size: 2.25rem;
  }
`;

const HeroTextContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const HeroTitle = styled.h2`
  margin: 0;
  font-size: clamp(1.25rem, 3vw, 1.75rem);
  font-weight: 800;
  color: white;
  letter-spacing: -0.02em;
  line-height: 1.3;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
`;

const HeroSubtitle = styled.p`
  margin: 0;
  font-size: clamp(0.9375rem, 2vw, 1.125rem);
  color: rgba(255, 255, 255, 0.95);
  font-weight: 500;
  line-height: 1.5;
`;

const HeroNotice = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  opacity: 0.85;
`;

const HeroNoticeIcon = styled.span`
  font-size: 0.875rem;
  flex-shrink: 0;
  opacity: 0.9;
`;

const HeroNoticeText = styled.p`
  margin: 0;
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 400;
  line-height: 1.4;
`;

const HeroArrow = styled.div`
  font-size: 2rem;
  color: white;
  font-weight: 700;
  transition: transform 0.3s ease;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);

  ${HeroBanner}:hover & {
    transform: translateX(8px);
  }

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const ImageBannerContainer = styled.div`
  margin: 2rem 0;
  width: 100%;
  position: relative;
  overflow: hidden;
  touch-action: pan-y pinch-zoom; /* 수평 스와이프만 캡처, 수직 스크롤은 허용 */
  cursor: grab;
  user-select: none; /* 드래그 시 텍스트/이미지 선택 방지 */

  &:active {
    cursor: grabbing;
  }

  @media (max-width: 768px) {
    margin: 1.5rem 0;
  }
`;

const BannerSlider = styled.div`
  display: flex;
  will-change: transform;
`;

const BannerSlide = styled.div`
  flex: 0 0 100%;
  min-width: 0;
  width: 100%;
  flex-shrink: 0;
  background: linear-gradient(135deg, #e5e7eb 0%, #f3f4f6 50%, #e5e7eb 100%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 20px;
  aspect-ratio: 16 / 9;
  overflow: hidden;

  @keyframes shimmer {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }

  @media (max-width: 768px) {
    border-radius: 16px;
    aspect-ratio: 16 / 10;
  }
`;

const BannerImage = styled.img<{ $loaded?: boolean }>`
  width: 100%;
  height: 100%;
  display: block;
  border-radius: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  object-fit: cover;
  pointer-events: none; /* 이미지 드래그 방지 */
  -webkit-user-drag: none; /* Safari 이미지 드래그 방지 */
  opacity: ${(props) => (props.$loaded ? 1 : 0)};
  transition: opacity 0.3s ease-out;

  @media (max-width: 768px) {
    border-radius: 16px;
  }
`;

const BannerDots = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const BannerDot = styled.div<{ $active: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${(props) =>
    props.$active ? "rgba(102, 126, 234, 1)" : "rgba(102, 126, 234, 0.3)"};
  cursor: pointer;
  transition: all 0.3s ease;
`;

const BannerArrow = styled.button<{ $direction: "left" | "right" }>`
  position: absolute;
  top: 50%;
  ${(props) => (props.$direction === "left" ? "left: 1rem;" : "right: 1rem;")}
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: rgba(0, 0, 0, 0.5);
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
  backdrop-filter: blur(4px);

  &:hover {
    background: rgba(255, 255, 255, 0.9);
    color: rgba(0, 0, 0, 0.7);
    transform: translateY(-50%) scale(1.1);
  }

  &:active {
    transform: translateY(-50%) scale(0.95);
  }

  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
    font-size: 1.2rem;
    ${(props) =>
      props.$direction === "left" ? "left: 0.5rem;" : "right: 0.5rem;"}
  }
`;

const PodcastItem = styled.div<{ $isNew?: boolean; $isSelected?: boolean }>`
  background: ${(props) =>
    props.$isSelected
      ? "linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%)"
      : "white"};
  border-radius: 20px;
  padding: 0;
  box-shadow: ${(props) =>
    props.$isSelected
      ? "0 4px 16px rgba(102, 126, 234, 0.2), 0 2px 8px rgba(0, 0, 0, 0.06)"
      : "0 1px 3px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.05)"};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  overflow: hidden;
  border: 1px solid
    ${(props) =>
      props.$isSelected ? "rgba(102, 126, 234, 0.3)" : "rgba(0, 0, 0, 0.04)"};
  animation: fadeInUp 0.5s ease-out both;
  position: relative;

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 768px) {
    border-radius: 16px;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.15),
      0 2px 8px rgba(0, 0, 0, 0.08);
    border-color: rgba(102, 126, 234, 0.2);
  }

  &:active {
    transform: translateY(-2px);
  }
`;

const NewBadge = styled.div`
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  z-index: 10;
  animation: pulse 2s ease-in-out infinite;

  @keyframes pulse {
    0%,
    100% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.05);
      opacity: 0.9;
    }
  }
`;

const NewBadgeText = styled.span`
  display: inline-block;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  font-size: 0.75rem;
  font-weight: 800;
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.4),
    0 4px 12px rgba(239, 68, 68, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
`;

const ItemContent = styled.div`
  padding: 1.75rem;

  @media (max-width: 768px) {
    padding: 1.25rem;
  }
`;

const ItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  gap: 1rem;

  @media (max-width: 768px) {
    margin-bottom: 1rem;
    gap: 0.75rem;
  }
`;

const ItemInfo = styled.div`
  flex: 1;
`;

const ItemDate = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1.375rem;
  font-weight: 700;
  color: #111827;
  line-height: 1.3;
  letter-spacing: -0.02em;

  @media (max-width: 768px) {
    font-size: 1.125rem;
    margin-bottom: 0.375rem;
  }
`;

const ItemTime = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
`;

const ItemMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const PlayCountBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.7rem;
  color: #667eea;
  background: rgba(102, 126, 234, 0.1);
  padding: 0.25rem 0.6rem;
  border-radius: 12px;
  font-weight: 600;
  border: 1px solid rgba(102, 126, 234, 0.15);
`;

const PlayCountIcon = styled.span`
  font-size: 0.65rem;
  display: flex;
  align-items: center;
`;

const PlayCountText = styled.span`
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.01em;
`;

const PlayIndicator = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 14px rgba(102, 126, 234, 0.35);

  ${PodcastItem}:hover & {
    transform: scale(1.08);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.45);
  }

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    border-radius: 12px;
  }
`;

const PlayIcon = styled.span`
  color: white;
  font-size: 1rem;
  margin-left: 3px;
  font-weight: 600;
`;

const DetailCard = styled.div<{ $compact?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: ${(props) => (props.$compact ? "0.5rem" : "0.625rem")};
  padding: ${(props) =>
    props.$compact ? "0.5rem 0.75rem" : "0.5rem 0.875rem"};
  background: #f8fafc;
  border-radius: ${(props) => (props.$compact ? "8px" : "8px")};
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;

  ${PodcastItem}:hover & {
    background: #f1f5f9;
    border-color: #cbd5e1;
  }
`;

const DetailIcon = styled.div<{ $small?: boolean }>`
  font-size: ${(props) => (props.$small ? "0.75rem" : "0.875rem")};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #64748b;
`;

const DetailContent = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.375rem;
  min-width: 0;
`;

const DetailLabel = styled.div<{ $small?: boolean }>`
  font-size: ${(props) => (props.$small ? "0.6875rem" : "0.75rem")};
  color: #94a3b8;
  font-weight: 500;
`;

const DetailValue = styled.div<{ $small?: boolean }>`
  font-size: ${(props) => (props.$small ? "0.875rem" : "0.9375rem")};
  color: #334155;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
`;

const ItemActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 0.75rem;
  }
`;

const TranscriptLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
  color: white;
  border-radius: 10px;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(6, 182, 212, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(6, 182, 212, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

const TranscriptIcon = styled.span`
  font-size: 1rem;
`;

const TranscriptText = styled.span`
  font-size: 0.875rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 6rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  opacity: 0.5;
`;

const EmptyText = styled.p`
  color: #6b7280;
  font-size: 1.125rem;
  font-weight: 500;
  margin: 0;
`;

const TodaySection = styled.section`
  margin-bottom: 4rem;
`;

const TodaySectionHeader = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
`;

const TodaySectionTitle = styled.h2`
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  color: #111827;
  margin: 0 0 0.75rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
`;

const TodayIcon = styled.span`
  font-size: 1.2em;
`;

const TodayListContainer = styled.div`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: 1fr;
`;

const QuickBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  color: #1e40af;
  padding: 0.375rem 0.75rem;
  border-radius: 16px;
  font-weight: 700;
  font-size: 0.8125rem;
  border: 1px solid rgba(59, 130, 246, 0.2);
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.1);
`;

const BadgeIcon = styled.span`
  font-size: 0.875rem;
  display: flex;
  align-items: center;
`;

const BadgeText = styled.span`
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.01em;
`;

const PastSection = styled.section`
  margin-top: 3rem;
`;

const PastSectionHeader = styled.div<{ $clickable?: boolean }>`
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  cursor: ${(props) => (props.$clickable ? "pointer" : "default")};
  transition: all 0.2s ease;

  &:hover {
    background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
    border-color: #cbd5e1;
  }

  @media (max-width: 768px) {
    padding: 0.875rem 1rem;
  }
`;

const PastSectionTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const PastSectionIcon = styled.span`
  font-size: 1.25rem;
`;

const PastSectionTitle = styled.h2`
  font-size: clamp(1.125rem, 2.5vw, 1.375rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #374151;
  margin: 0;
`;

const PastSectionCount = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: #667eea;
  background: rgba(102, 126, 234, 0.1);
  padding: 0.25rem 0.625rem;
  border-radius: 12px;
`;

const PastSectionToggle = styled.div<{ $expanded: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #667eea;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.2s ease;
`;

const ToggleIcon = styled.span`
  font-size: 0.75rem;
  transition: transform 0.3s ease;
`;

const ToggleText = styled.span`
  @media (max-width: 480px) {
    display: none;
  }
`;

const PastListWrapper = styled.div<{ $expanded: boolean }>`
  max-height: ${(props) => (props.$expanded ? "500px" : "0")};
  overflow: hidden;
  transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1);
`;

const PastListContainer = styled.div`
  max-height: 480px;
  overflow-y: auto;
  padding-right: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  /* 스크롤바 스타일링 */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
    transition: background 0.2s;

    &:hover {
      background: #94a3b8;
    }
  }

  @media (max-width: 768px) {
    max-height: 400px;
    padding-right: 0.25rem;
  }
`;

const PastPodcastItem = styled.div<{ $isSelected?: boolean }>`
  background: ${(props) =>
    props.$isSelected
      ? "linear-gradient(to right, rgba(102, 126, 234, 0.08), rgba(118, 75, 162, 0.06))"
      : "white"};
  border-radius: 12px;
  padding: 0;
  box-shadow: ${(props) =>
    props.$isSelected
      ? "0 2px 8px rgba(102, 126, 234, 0.15)"
      : "0 1px 2px rgba(0, 0, 0, 0.04)"};
  transition: all 0.2s ease;
  cursor: pointer;
  border: 1px solid
    ${(props) => (props.$isSelected ? "rgba(102, 126, 234, 0.3)" : "#e5e7eb")};
  animation: fadeIn 0.3s ease-out both;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateX(-10px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  &:hover {
    transform: translateX(4px);
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.12);
    border-color: rgba(102, 126, 234, 0.3);
    background: linear-gradient(to right, white, #fafbff);
  }

  &:active {
    transform: translateX(2px);
  }
`;

const PastItemContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  gap: 1rem;

  @media (max-width: 768px) {
    padding: 0.875rem 1rem;
    gap: 0.75rem;
  }
`;

const PastItemInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const PastItemDate = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;

  @media (max-width: 768px) {
    font-size: 0.9375rem;
  }
`;

const PastItemMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const PastItemTime = styled.span`
  font-size: 0.8125rem;
  color: #6b7280;
  font-weight: 500;
`;

const PastItemDuration = styled.span`
  font-size: 0.75rem;
  color: #667eea;
  font-weight: 600;
  background: rgba(102, 126, 234, 0.08);
  padding: 0.125rem 0.5rem;
  border-radius: 6px;
`;

const PastItemPlayCount = styled.span`
  font-size: 0.75rem;
  color: #9ca3af;
  font-weight: 500;
`;

const PastTimelineBadge = styled.span`
  font-size: 0.6875rem;
  color: #0891b2;
  font-weight: 600;
  background: rgba(6, 182, 212, 0.1);
  padding: 0.125rem 0.5rem;
  border-radius: 6px;
  border: 1px solid rgba(6, 182, 212, 0.2);
`;

const PastTranscriptLink = styled(Link)`
  font-size: 0.6875rem;
  color: #06b6d4;
  font-weight: 600;
  background: rgba(6, 182, 212, 0.1);
  padding: 0.125rem 0.5rem;
  border-radius: 6px;
  border: 1px solid rgba(6, 182, 212, 0.2);
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(6, 182, 212, 0.2);
    border-color: rgba(6, 182, 212, 0.4);
  }
`;

const PastPlayIndicator = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: white;
  font-size: 0.75rem;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  transition: all 0.2s ease;

  ${PastPodcastItem}:hover & {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }
`;
