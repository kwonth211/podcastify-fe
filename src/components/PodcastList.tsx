import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import styled from "styled-components";
import dayjs from "dayjs";
import { listAudioFiles, getAudioUrl } from "../utils/r2Client";
import AudioPlayer from "./AudioPlayer";
import type { PodcastFile } from "../types";

function PodcastList() {
  const [podcasts, setPodcasts] = useState<PodcastFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPodcast, setSelectedPodcast] = useState<PodcastFile | null>(
    null
  );
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [playTrigger, setPlayTrigger] = useState(0);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  useEffect(() => {
    loadPodcasts();
  }, []);

  // URL에서 playerId 읽어서 선택 및 스크롤
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const playerId = urlParams.get("playerId");

    if (playerId && podcasts.length > 0) {
      const podcast = podcasts.find((p) => p.key === playerId);
      if (
        podcast &&
        (!selectedPodcast || selectedPodcast.key !== podcast.key)
      ) {
        // URL 기반으로 직접 로드 (무한 루프 방지)
        const loadFromUrl = async () => {
          try {
            setSelectedPodcast(podcast);
            const audioUrl = await getAudioUrl(podcast.key);
            setAudioUrl(audioUrl);

            // 오디오 길이 가져오기
            const audio = new Audio(audioUrl);
            audio.addEventListener("loadedmetadata", () => {
              const duration = audio.duration;
              setSelectedPodcast((prev) =>
                prev ? { ...prev, duration } : null
              );
              setPodcasts((prev) =>
                prev.map((p) =>
                  p.key === podcast.key ? { ...p, duration } : p
                )
              );
            });
            audio.load();

            // 해당 엘리먼트로 스크롤 (약간의 지연 후)
            setTimeout(() => {
              const element = document.getElementById(`podcast-${podcast.key}`);
              if (element) {
                const elementRect = element.getBoundingClientRect();
                const absoluteElementTop = elementRect.top + window.pageYOffset;
                const middle =
                  absoluteElementTop -
                  window.innerHeight / 2 +
                  elementRect.height / 2;
                window.scrollTo({
                  top: middle,
                  behavior: "smooth",
                });
              }
            }, 200);
          } catch (err) {
            console.error("URL에서 팟캐스트 로드 실패:", err);
          }
        };
        loadFromUrl();
      }
    }
  }, [podcasts, selectedPodcast]);

  // 배너 자동 슬라이드
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % 3);
    }, 4000); // 4초마다 슬라이드

    return () => clearInterval(interval);
  }, [currentBannerIndex]); // currentBannerIndex가 변경되면 타이머 재시작

  const loadPodcasts = async () => {
    try {
      setLoading(true);
      setError(null);
      const files = await listAudioFiles();
      setPodcasts(files);

      // 각 팟캐스트의 duration과 재생 횟수를 병렬로 로드
      await Promise.all([loadDurations(files), loadPlayCounts(files)]);
    } catch (err) {
      setError("팟캐스트 목록을 불러오는데 실패했습니다.");
      console.error(err);
    } finally {
      setLoading(false);
    }
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

  const loadPlayCounts = async (files: PodcastFile[]) => {
    // 각 팟캐스트의 재생 횟수 로드
    await Promise.all(
      files.map(async (file) => {
        try {
          const response = await fetch(
            `/api/count?key=${encodeURIComponent(file.key)}`
          );
          const data = await response.json();
          if (data.count !== undefined) {
            setPodcasts((prev) =>
              prev.map((p) =>
                p.key === file.key ? { ...p, playCount: data.count } : p
              )
            );
          }
        } catch (err) {
          console.warn(`Failed to load play count for ${file.key}:`, err);
        }
      })
    );
  };

  const handlePodcastClick = async (podcast: PodcastFile) => {
    try {
      // URL 업데이트
      const url = new URL(window.location.href);
      url.searchParams.set("playerId", podcast.key);
      window.history.pushState({}, "", url.toString());

      setSelectedPodcast(podcast);
      const audioUrl = await getAudioUrl(podcast.key);
      setAudioUrl(audioUrl);

      // 오디오 길이 가져오기
      const audio = new Audio(audioUrl);
      audio.addEventListener("loadedmetadata", () => {
        const duration = audio.duration;
        setSelectedPodcast((prev) => (prev ? { ...prev, duration } : null));
        setPodcasts((prev) =>
          prev.map((p) => (p.key === podcast.key ? { ...p, duration } : p))
        );
      });

      // 재생 횟수 업데이트 (재생 버튼 클릭 시 증가하지만, 여기서는 현재 값만 확인)
      if (podcast.playCount === undefined) {
        try {
          const response = await fetch(
            `/api/count?key=${encodeURIComponent(podcast.key)}`
          );
          const data = await response.json();
          if (data.count !== undefined) {
            setPodcasts((prev) =>
              prev.map((p) =>
                p.key === podcast.key ? { ...p, playCount: data.count } : p
              )
            );
          }
        } catch (err) {
          console.warn("재생 횟수 가져오기 실패:", err);
        }
      }
    } catch (err) {
      setError("오디오 파일을 불러오는데 실패했습니다.");
      console.error(err);
    }
  };

  // URL 변경 감지 (뒤로가기/앞으로가기)
  useEffect(() => {
    const handlePopState = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const playerId = urlParams.get("playerId");

      if (playerId && podcasts.length > 0) {
        const podcast = podcasts.find((p) => p.key === playerId);
        if (podcast) {
          setSelectedPodcast(podcast);
          getAudioUrl(podcast.key).then((url) => {
            setAudioUrl(url);
            // 해당 엘리먼트로 스크롤
            setTimeout(() => {
              const element = document.getElementById(`podcast-${podcast.key}`);
              if (element) {
                const elementRect = element.getBoundingClientRect();
                const absoluteElementTop = elementRect.top + window.pageYOffset;
                const middle =
                  absoluteElementTop -
                  window.innerHeight / 2 +
                  elementRect.height / 2;
                window.scrollTo({
                  top: middle,
                  behavior: "smooth",
                });
              }
            }, 200);
          });
        }
      } else {
        setSelectedPodcast(null);
        setAudioUrl(null);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [podcasts]);

  const formatDate = (dateString: string): string => {
    const date = dayjs(dateString, "YYYY-MM-DD");
    const weekdays = [
      "일요일",
      "월요일",
      "화요일",
      "수요일",
      "목요일",
      "금요일",
      "토요일",
    ];
    return `${date.format("YYYY년 M월 D일")} ${weekdays[date.day()]}`;
  };

  const formatShortDate = (dateString: string): string => {
    return dayjs(dateString, "YYYY-MM-DD").format("YYYY년 M월 D일");
  };

  const formatRelativeTime = (date: string): string => {
    const targetDate = dayjs(date, "YYYY-MM-DD");
    if (!targetDate.isValid()) return "";

    const today = dayjs().startOf("day");
    const target = targetDate.startOf("day");
    const days = today.diff(target, "day");

    if (days === 0) return "오늘";
    if (days === 1) return "어제";
    if (days < 7) return `${days}일 전`;
    if (days < 30) return `${Math.floor(days / 7)}주 전`;
    if (days < 365) return `${Math.floor(days / 30)}개월 전`;
    return `${Math.floor(days / 365)}년 전`;
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
          <LoadingText>로딩 중...</LoadingText>
        </LoadingContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Helmet>
        <title>Daily News Podcast - AI가 요약한 오늘의 뉴스 팟캐스트</title>
        <meta
          name="description"
          content="AI가 요약한 오늘의 뉴스를 팟캐스트로 들어보세요. 매일 최신 뉴스를 음성으로 제공합니다."
        />
        <meta property="og:url" content="https://dailynewspod.com/" />
        <meta
          property="og:title"
          content="Daily News Podcast - AI가 요약한 오늘의 뉴스 팟캐스트"
        />
        <meta
          property="og:description"
          content="AI가 요약한 오늘의 뉴스를 팟캐스트로 들어보세요. 매일 최신 뉴스를 음성으로 제공합니다."
        />
        <meta property="twitter:url" content="https://dailynewspod.com/" />
        <meta
          property="twitter:title"
          content="Daily News Podcast - AI가 요약한 오늘의 뉴스 팟캐스트"
        />
        <meta
          property="twitter:description"
          content="AI가 요약한 오늘의 뉴스를 팟캐스트로 들어보세요. 매일 최신 뉴스를 음성으로 제공합니다."
        />
      </Helmet>
      <Header>
        <Title>Daily News Podcast</Title>
      </Header>

      {/* 이미지 배너 슬라이더 */}
      <ImageBannerContainer>
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
            transform: `translateX(-${currentBannerIndex * 100}%)`,
          }}
        >
          <BannerSlide>
            <BannerImage src="/a.png" alt="Banner 1" />
          </BannerSlide>
          <BannerSlide>
            <BannerImage src="/b.png" alt="Banner 2" />
          </BannerSlide>
          <BannerSlide>
            <BannerImage src="/c.png" alt="Banner 3" />
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
          if (hasToday && firstTodayPodcast) {
            // 이미 선택된 팟캐스트면 URL을 변경하지 않고 재생만 트리거
            if (selectedPodcast?.key === firstTodayPodcast.key && audioUrl) {
              // 같은 팟캐스트이므로 재생 트리거만 증가
              setPlayTrigger((prev) => prev + 1);
            } else {
              // 새로운 팟캐스트이므로 URL 업데이트와 함께 처리
              handlePodcastClick(firstTodayPodcast);
            }
          }
        };

        return (
          <HeroBanner onClick={handleBannerClick}>
            <HeroContent>
              <HeroIcon>{hasToday ? "🎯" : "🎙️"}</HeroIcon>
              <HeroTextContainer>
                <HeroTitle>
                  {hasToday
                    ? "지금 바로 오늘의 뉴스를 들어보세요"
                    : "AI가 요약한 오늘의 뉴스를 팟캐스트로 들어보세요"}
                </HeroTitle>
                <HeroSubtitle>
                  {hasToday
                    ? "오늘의 주요 헤드라인 요약"
                    : "매일 최신 뉴스를 음성으로 제공합니다"}
                </HeroSubtitle>
                <HeroNotice>
                  <HeroNoticeIcon>ℹ️</HeroNoticeIcon>
                  <HeroNoticeText>
                    AI는 아직 한국어 지원이 안정적이지 않을 수 있습니다.
                  </HeroNoticeText>
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
          <EmptyText>등록된 팟캐스트가 없습니다.</EmptyText>
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
                      오늘의 뉴스
                    </TodaySectionTitle>
                  </TodaySectionHeader>
                  <TodayListContainer>
                    {todayPodcasts.map((podcast, index) => {
                      const isSelected = selectedPodcast?.key === podcast.key;
                      const showPlayer = isSelected && audioUrl;

                      if (showPlayer) {
                        return (
                          <PlayerWrapper
                            key={podcast.key}
                            id={`podcast-${podcast.key}`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <AudioPlayer
                              audioUrl={audioUrl}
                              date={formatDate(selectedPodcast.date)}
                              title={`${formatDate(selectedPodcast.date)}`}
                              duration={selectedPodcast.duration}
                              podcastKey={selectedPodcast.key}
                              playCount={selectedPodcast.playCount}
                              triggerPlay={playTrigger}
                              onPlayCountUpdate={(count: number) => {
                                setPodcasts((prev) =>
                                  prev.map((p) =>
                                    p.key === selectedPodcast.key
                                      ? { ...p, playCount: count }
                                      : p
                                  )
                                );
                              }}
                              onDownload={async () => {
                                try {
                                  const response = await fetch(audioUrl);
                                  const blob = await response.blob();
                                  const url = window.URL.createObjectURL(blob);
                                  const link = document.createElement("a");
                                  link.href = url;
                                  link.download = `podcast_${selectedPodcast.date.replace(
                                    /-/g,
                                    ""
                                  )}.mp3`;
                                  document.body.appendChild(link);
                                  link.click();
                                  document.body.removeChild(link);
                                  window.URL.revokeObjectURL(url);
                                } catch (err) {
                                  console.error("다운로드 실패:", err);
                                  window.open(audioUrl, "_blank");
                                }
                              }}
                            />
                          </PlayerWrapper>
                        );
                      }

                      const isNew = isToday(podcast.date);

                      return (
                        <PodcastItem
                          key={podcast.key}
                          id={`podcast-${podcast.key}`}
                          onClick={() => handlePodcastClick(podcast)}
                          style={{ animationDelay: `${index * 0.05}s` }}
                          $isNew={isNew}
                        >
                          {isNew && (
                            <NewBadge>
                              <NewBadgeText>NEW</NewBadgeText>
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
                                  {podcast.playCount !== undefined && (
                                    <PlayCountBadge>
                                      <PlayCountIcon>▶</PlayCountIcon>
                                      <PlayCountText>
                                        조회수: {formatCount(podcast.playCount)}
                                      </PlayCountText>
                                    </PlayCountBadge>
                                  )}
                                  {podcast.duration &&
                                    podcast.duration <= 180 && (
                                      <QuickBadge>
                                        <BadgeIcon>⏱️</BadgeIcon>
                                        <BadgeText>3분요약</BadgeText>
                                      </QuickBadge>
                                    )}
                                </ItemMeta>
                              </ItemInfo>
                              <PlayIndicator>
                                <PlayIcon>▶</PlayIcon>
                              </PlayIndicator>
                            </ItemHeader>

                            {podcast.duration && (
                              <ItemDetails>
                                <DetailCard>
                                  <DetailIcon>⏱️</DetailIcon>
                                  <DetailContent>
                                    <DetailLabel>재생 시간</DetailLabel>
                                    <DetailValue>
                                      {formatDuration(podcast.duration)}
                                    </DetailValue>
                                  </DetailContent>
                                </DetailCard>
                              </ItemDetails>
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
                  {podcasts.some((p) => isToday(p.date)) && (
                    <PastSectionHeader>
                      <PastSectionTitle>과거 뉴스</PastSectionTitle>
                    </PastSectionHeader>
                  )}
                  <ListContainer>
                    {pastPodcasts.map((podcast, index) => {
                      const isSelected = selectedPodcast?.key === podcast.key;
                      const showPlayer = isSelected && audioUrl;

                      if (showPlayer) {
                        return (
                          <PlayerWrapper
                            key={podcast.key}
                            id={`podcast-${podcast.key}`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <AudioPlayer
                              audioUrl={audioUrl}
                              date={formatDate(selectedPodcast.date)}
                              title={`${formatDate(selectedPodcast.date)}`}
                              duration={selectedPodcast.duration}
                              podcastKey={selectedPodcast.key}
                              playCount={selectedPodcast.playCount}
                              triggerPlay={playTrigger}
                              onPlayCountUpdate={(count: number) => {
                                setPodcasts((prev) =>
                                  prev.map((p) =>
                                    p.key === selectedPodcast.key
                                      ? { ...p, playCount: count }
                                      : p
                                  )
                                );
                              }}
                              onDownload={async () => {
                                try {
                                  const response = await fetch(audioUrl);
                                  const blob = await response.blob();
                                  const url = window.URL.createObjectURL(blob);
                                  const link = document.createElement("a");
                                  link.href = url;
                                  link.download = `podcast_${selectedPodcast.date.replace(
                                    /-/g,
                                    ""
                                  )}.mp3`;
                                  document.body.appendChild(link);
                                  link.click();
                                  document.body.removeChild(link);
                                  window.URL.revokeObjectURL(url);
                                } catch (err) {
                                  console.error("다운로드 실패:", err);
                                  window.open(audioUrl, "_blank");
                                }
                              }}
                            />
                          </PlayerWrapper>
                        );
                      }

                      return (
                        <PodcastItem
                          key={podcast.key}
                          onClick={() => handlePodcastClick(podcast)}
                          style={{ animationDelay: `${index * 0.05}s` }}
                          $isNew={false}
                        >
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
                                  {podcast.playCount !== undefined && (
                                    <PlayCountBadge>
                                      <PlayCountIcon>▶</PlayCountIcon>
                                      <PlayCountText>
                                        조회수: {formatCount(podcast.playCount)}
                                      </PlayCountText>
                                    </PlayCountBadge>
                                  )}
                                  {podcast.duration &&
                                    podcast.duration <= 180 && (
                                      <QuickBadge>
                                        <BadgeIcon>⏱️</BadgeIcon>
                                        <BadgeText>3분요약</BadgeText>
                                      </QuickBadge>
                                    )}
                                </ItemMeta>
                              </ItemInfo>
                              <PlayIndicator>
                                <PlayIcon>▶</PlayIcon>
                              </PlayIndicator>
                            </ItemHeader>

                            {podcast.duration && (
                              <ItemDetails>
                                <DetailCard>
                                  <DetailIcon>⏱️</DetailIcon>
                                  <DetailContent>
                                    <DetailLabel>재생 시간</DetailLabel>
                                    <DetailValue>
                                      {formatDuration(podcast.duration)}
                                    </DetailValue>
                                  </DetailContent>
                                </DetailCard>
                              </ItemDetails>
                            )}
                          </ItemContent>
                        </PodcastItem>
                      );
                    })}
                  </ListContainer>
                </PastSection>
              );
            }
            return null;
          })()}
        </>
      )}
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
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 1rem;
`;

const Title = styled.h1`
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
  line-height: 1.2;
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

const HeroBanner = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  border-radius: 20px;
  padding: 2rem 2.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3),
    0 4px 16px rgba(102, 126, 234, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

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

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(102, 126, 234, 0.4),
      0 6px 20px rgba(102, 126, 234, 0.3);
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
    font-size: 2.5rem;
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
`;

const BannerSlider = styled.div`
  display: flex;
  transition: transform 0.5s ease-in-out;
`;

const BannerSlide = styled.div`
  flex: 0 0 100%;
  min-width: 0;
  width: 100%;
  flex-shrink: 0;
`;

const BannerImage = styled.img`
  width: 100%;
  height: auto;
  display: block;
  border-radius: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  object-fit: contain;
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

const ListContainer = styled.div`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: 1fr;
`;

const PlayerWrapper = styled.div`
  grid-column: 1 / -1;
  margin-bottom: 1rem;
`;

const PodcastItem = styled.div<{ $isNew?: boolean }>`
  background: white;
  border-radius: 20px;
  padding: 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.04);
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
  left: 1rem;
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
`;

const ItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  gap: 1rem;
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
`;

const PlayIcon = styled.span`
  color: white;
  font-size: 1rem;
  margin-left: 3px;
  font-weight: 600;
`;

const ItemDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
`;

const DetailCard = styled.div<{ $compact?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${(props) => (props.$compact ? "0.5rem" : "0.875rem")};
  padding: ${(props) => (props.$compact ? "0.6rem 0.75rem" : "1rem")};
  background: #f9fafb;
  border-radius: ${(props) => (props.$compact ? "8px" : "12px")};
  border: 1px solid #e5e7eb;
  transition: all 0.2s;

  ${PodcastItem}:hover & {
    background: #f3f4f6;
    border-color: #d1d5db;
  }
`;

const DetailIcon = styled.div<{ $small?: boolean }>`
  font-size: ${(props) => (props.$small ? "0.9rem" : "1.5rem")};
  width: ${(props) => (props.$small ? "28px" : "40px")};
  height: ${(props) => (props.$small ? "28px" : "40px")};
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: ${(props) => (props.$small ? "6px" : "10px")};
  flex-shrink: 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  color: ${(props) => (props.$small ? "#667eea" : "inherit")};
  font-weight: ${(props) => (props.$small ? "600" : "normal")};
`;

const DetailContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
`;

const DetailLabel = styled.div<{ $small?: boolean }>`
  font-size: ${(props) => (props.$small ? "0.65rem" : "0.75rem")};
  color: #6b7280;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const DetailValue = styled.div<{ $small?: boolean }>`
  font-size: ${(props) => (props.$small ? "0.8rem" : "0.9375rem")};
  color: #111827;
  font-weight: 700;
  letter-spacing: -0.01em;
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

const PastSectionHeader = styled.div`
  margin-bottom: 2rem;
`;

const PastSectionTitle = styled.h2`
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #374151;
  margin: 0;
`;
