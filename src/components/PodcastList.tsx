import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import styled from "styled-components";
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

  useEffect(() => {
    loadPodcasts();
  }, []);

  const loadPodcasts = async () => {
    try {
      setLoading(true);
      setError(null);
      const files = await listAudioFiles();
      setPodcasts(files);

      // 각 팟캐스트의 duration을 병렬로 로드
      loadDurations(files);
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

  const handlePodcastClick = async (podcast: PodcastFile) => {
    try {
      setSelectedPodcast(podcast);
      const url = await getAudioUrl(podcast.key);
      setAudioUrl(url);

      // 오디오 길이 가져오기
      const audio = new Audio(url);
      audio.addEventListener("loadedmetadata", () => {
        const duration = audio.duration;
        setSelectedPodcast((prev) => (prev ? { ...prev, duration } : null));
        setPodcasts((prev) =>
          prev.map((p) => (p.key === podcast.key ? { ...p, duration } : p))
        );
      });
    } catch (err) {
      setError("오디오 파일을 불러오는데 실패했습니다.");
      console.error(err);
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });
  };

  const formatShortDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatRelativeTime = (date?: Date | string): string => {
    if (!date) return "";
    const dateObj = typeof date === "string" ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return "";

    const now = new Date();
    const diff = now.getTime() - dateObj.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

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

  const isToday = (dateString: string): boolean => {
    const date = new Date(dateString);
    const today = new Date();
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
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
        <title>Daily News Podcast - AI로 만드는 데일리 뉴스 팟캐스트</title>
        <meta
          name="description"
          content="AI 기술로 제작된 데일리 뉴스를 팟캐스트로 들어보세요. 매일 최신 뉴스를 음성으로 제공합니다."
        />
        <meta property="og:url" content="https://dailynewspod.com/" />
        <meta
          property="og:title"
          content="Daily News Podcast - AI로 만드는 데일리 뉴스 팟캐스트"
        />
        <meta
          property="og:description"
          content="AI 기술로 제작된 데일리 뉴스를 팟캐스트로 들어보세요. 매일 최신 뉴스를 음성으로 제공합니다."
        />
        <meta property="twitter:url" content="https://dailynewspod.com/" />
        <meta
          property="twitter:title"
          content="Daily News Podcast - AI로 만드는 데일리 뉴스 팟캐스트"
        />
        <meta
          property="twitter:description"
          content="AI 기술로 제작된 데일리 뉴스를 팟캐스트로 들어보세요. 매일 최신 뉴스를 음성으로 제공합니다."
        />
      </Helmet>
      <Header>
        <Title>Daily News Podcast</Title>
        <Subtitle>AI로 만드는 데일리 뉴스를 팟캐스트로 들어보세요</Subtitle>
      </Header>

      <NoticeContainer>
        <NoticeIcon>ℹ️</NoticeIcon>
        <NoticeText>
          AI는 아직 한국어 지원이 안정적이지 않을 수 있습니다.
        </NoticeText>
      </NoticeContainer>

      {error && <ErrorContainer>{error}</ErrorContainer>}

      {podcasts.length === 0 ? (
        <EmptyState>
          <EmptyIcon>🎙️</EmptyIcon>
          <EmptyText>등록된 팟캐스트가 없습니다.</EmptyText>
        </EmptyState>
      ) : (
        <ListContainer>
          {podcasts.map((podcast, index) => {
            const isSelected = selectedPodcast?.key === podcast.key;
            const showPlayer = isSelected && audioUrl;

            if (showPlayer) {
              return (
                <PlayerWrapper
                  key={podcast.key}
                  onClick={(e) => e.stopPropagation()}
                >
                  <AudioPlayer
                    audioUrl={audioUrl}
                    date={formatDate(selectedPodcast.date)}
                    title={`${formatDate(selectedPodcast.date)} 뉴스`}
                    duration={selectedPodcast.duration}
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
                      <ItemDate>{formatShortDate(podcast.date)}</ItemDate>
                      {podcast.lastModified && (
                        <ItemTime>
                          {formatRelativeTime(podcast.lastModified)}
                        </ItemTime>
                      )}
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
  margin-bottom: 4rem;
  padding-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
  line-height: 1.2;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: #6b7280;
  margin: 0;
  font-weight: 400;
  letter-spacing: 0.01em;
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

const NoticeContainer = styled.div`
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
  color: #6b7280;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  font-weight: 400;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.06);
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`;

const NoticeIcon = styled.span`
  font-size: 1.25rem;
  flex-shrink: 0;
`;

const NoticeText = styled.p`
  margin: 0;
  font-size: 0.9375rem;
  line-height: 1.5;
`;

const ListContainer = styled.div`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: 1fr;

  @media (min-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 2rem;
  }
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
  border: 1px solid
    ${(props) =>
      props.$isNew ? "rgba(239, 68, 68, 0.2)" : "rgba(0, 0, 0, 0.04)"};
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

  ${(props) =>
    props.$isNew &&
    `
    background: linear-gradient(135deg, #fff5f5 0%, #ffffff 100%);
    border-color: rgba(239, 68, 68, 0.3);
  `}

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px
        ${(props) =>
          props.$isNew
            ? "rgba(239, 68, 68, 0.2)"
            : "rgba(102, 126, 234, 0.15)"},
      0 2px 8px rgba(0, 0, 0, 0.08);
    border-color: ${(props) =>
      props.$isNew ? "rgba(239, 68, 68, 0.4)" : "rgba(102, 126, 234, 0.2)"};
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

const DetailCard = styled.div`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  transition: all 0.2s;

  ${PodcastItem}:hover & {
    background: #f3f4f6;
    border-color: #d1d5db;
  }
`;

const DetailIcon = styled.div`
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 10px;
  flex-shrink: 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const DetailContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
`;

const DetailLabel = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const DetailValue = styled.div`
  font-size: 0.9375rem;
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
