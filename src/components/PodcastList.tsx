import { useState, useEffect } from "react";
import styled from "styled-components";
import { listAudioFiles, getAudioUrl } from "../utils/r2Client";
import AudioPlayer from "./AudioPlayer";
import type { PodcastFile } from "../types";
//
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
    } catch (err) {
      setError("팟캐스트 목록을 불러오는데 실패했습니다.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePodcastClick = async (podcast: PodcastFile) => {
    try {
      setSelectedPodcast(podcast);
      const url = await getAudioUrl(podcast.key);
      setAudioUrl(url);
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

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return "";
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  if (loading) {
    return (
      <Container>
        <LoadingContainer>로딩 중...</LoadingContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Daily News Podcast</Title>
        <Subtitle>데일리 뉴스를 팟캐스트로 들어보세요</Subtitle>
      </Header>

      {error && <ErrorContainer>{error}</ErrorContainer>}

      {podcasts.length === 0 ? (
        <EmptyState>
          <p>등록된 팟캐스트가 없습니다.</p>
        </EmptyState>
      ) : (
        <ListContainer>
          {podcasts.map((podcast) => {
            const isSelected = selectedPodcast?.key === podcast.key;
            const showPlayer = isSelected && audioUrl;

            if (showPlayer) {
              return (
                <div key={podcast.key} onClick={(e) => e.stopPropagation()}>
                  <AudioPlayer
                    audioUrl={audioUrl}
                    date={formatDate(selectedPodcast.date)}
                    title={`${formatDate(selectedPodcast.date)} 뉴스`}
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
                        // fallback: 직접 링크 열기
                        window.open(audioUrl, "_blank");
                      }
                    }}
                  />
                </div>
              );
            }

            return (
              <PodcastItem
                key={podcast.key}
                onClick={() => handlePodcastClick(podcast)}
              >
                <ItemHeader>
                  <ItemDate>{formatDate(podcast.date)}</ItemDate>
                  <ItemSize>{formatFileSize(podcast.size)}</ItemSize>
                </ItemHeader>
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
  padding: 2rem;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #666;
  margin: 0;
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: 4rem;
  color: #666;
`;

const ErrorContainer = styled.div`
  background: #fee;
  color: #c33;
  padding: 1.5rem;
  border-radius: 10px;
  margin-bottom: 2rem;
  text-align: center;
`;

const ListContainer = styled.div`
  display: grid;
  gap: 2rem;
`;

const PodcastItem = styled.div`
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
  }
`;

const ItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: white;
  align-items: center;
  margin-bottom: 1rem;
`;

const ItemDate = styled.h3`
  margin: 0;
  font-size: 1.3rem;
  color: #333;
`;

const ItemSize = styled.span`
  color: #666;
  font-size: 0.9rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem;
  color: #666;
`;
