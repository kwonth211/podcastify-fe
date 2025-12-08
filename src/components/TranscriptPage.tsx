import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import styled from "styled-components";
import dayjs from "dayjs";
import { getAudioUrl } from "../utils/r2Client";
import { usePlayer } from "../contexts/PlayerContext";
import Timeline, {
  TimelineItem,
  parseTimeline,
  getTimelineKey,
} from "./Timeline";

interface TranscriptLine {
  speaker: "Person1" | "Person2";
  text: string;
}

// podcastKey에서 transcript 파일 키 생성
const getTranscriptKey = (key: string): string => {
  const fileName = key.includes("/") ? key.split("/").pop()! : key;
  return fileName.replace("_podcast_", "_transcript_").replace(".mp3", ".txt");
};

// podcastKey에서 날짜 추출 (파일명 끝의 _YYYYMMDD 패턴)
const extractDateFromKey = (key: string): string => {
  // _YYYYMMDD. 패턴으로 파일명 끝의 날짜를 정확히 추출
  const match = key.match(/_(\d{4})(\d{2})(\d{2})\./);
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`;
  }
  return "";
};

// 대본 내용에서 Person 태그 파싱
const parseContent = (content: string): TranscriptLine[] => {
  const lines: TranscriptLine[] = [];
  const regex = /<(Person[12])>([\s\S]*?)<\/\1>/g;
  let match;

  while ((match = regex.exec(content)) !== null) {
    lines.push({
      speaker: match[1] as "Person1" | "Person2",
      text: match[2].trim(),
    });
  }

  return lines;
};

function TranscriptPage() {
  const { key } = useParams<{ key: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { playPodcast, playerState } = usePlayer();
  const decodedKey = key ? decodeURIComponent(key) : "";

  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);
  const [fullTranscript, setFullTranscript] = useState<string>(""); // 전체 대본
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const date = extractDateFromKey(decodedKey);
  const formattedDate = date ? dayjs(date).format("YYYY년 M월 D일") : "";

  // 초기 시간 파라미터
  const initialTime = searchParams.get("t");

  // 현재 재생 시간 (전역 플레이어에서 가져옴)
  const currentTime =
    playerState.podcastKey === decodedKey ? playerState.currentTime : 0;

  // 대본 및 오디오 로드
  useEffect(() => {
    if (!decodedKey) return;

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const publicUrl = import.meta.env.VITE_R2_PUBLIC_URL;
        if (!publicUrl) {
          throw new Error("Public URL not configured");
        }

        // 오디오 URL 가져오기
        const url = await getAudioUrl(decodedKey);
        setAudioUrl(url);

        // 타임라인 파일과 대본 파일 동시에 로드
        const timelineKey = getTimelineKey(decodedKey);
        const transcriptKey = getTranscriptKey(decodedKey);

        const [timelineResponse, transcriptResponse] = await Promise.all([
          fetch(`${publicUrl}/${timelineKey}`).catch(() => null),
          fetch(`${publicUrl}/${transcriptKey}`).catch(() => null),
        ]);

        let timeline: TimelineItem[] = [];
        let transcriptText = "";

        // 타임라인 파싱
        if (timelineResponse?.ok) {
          const timelineText = await timelineResponse.text();
          timeline = parseTimeline(timelineText);
        }

        // 대본 파싱
        if (transcriptResponse?.ok) {
          transcriptText = await transcriptResponse.text();
        }

        if (timeline.length === 0 && !transcriptText) {
          throw new Error("대본 또는 타임라인 파일을 찾을 수 없습니다.");
        }

        setTimelineItems(timeline);
        setFullTranscript(transcriptText);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "대본을 불러오는데 실패했습니다."
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [decodedKey]);

  // 초기 시간 파라미터가 있으면 전역 플레이어로 재생 시작
  useEffect(() => {
    if (audioUrl && initialTime) {
      const time = parseInt(initialTime, 10);
      if (!isNaN(time)) {
        playPodcast(decodedKey, audioUrl, formattedDate, time);
      }
    }
  }, [audioUrl, initialTime, decodedKey, formattedDate, playPodcast]);

  // 타임라인 클릭 시 전역 플레이어로 재생
  const handleTimelineClick = (time: number) => {
    if (!audioUrl) return;
    playPodcast(decodedKey, audioUrl, formattedDate, time);
  };

  if (loading) {
    return (
      <Container>
        <LoadingMessage>대본을 불러오는 중...</LoadingMessage>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorContainer>
          <ErrorIcon>📄</ErrorIcon>
          <ErrorMessage>{error}</ErrorMessage>
          <BackButton onClick={() => navigate("/")}>← 돌아가기</BackButton>
        </ErrorContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Helmet>
        <title>{formattedDate} 대본 - Daily News Podcast</title>
        <meta
          name="description"
          content={`${formattedDate} Daily News Podcast 대본`}
        />
      </Helmet>

      {/* 헤더 */}
      <Header>
        <BackButton onClick={() => navigate("/")}>← 돌아가기</BackButton>
        <HeaderTitle>
          <HeaderIcon>📄</HeaderIcon>
          {formattedDate} 대본
        </HeaderTitle>
      </Header>

      {/* 콘텐츠 영역 */}
      <TranscriptContainer>
        {/* 타임라인 - 공통 컴포넌트 사용 */}
        {timelineItems.length > 0 && (
          <Timeline
            items={timelineItems}
            currentTime={currentTime}
            onTimeClick={handleTimelineClick}
            variant="card"
            maxHeight="280px"
            showActiveIndicator
          />
        )}

        {/* 전체 대본 - 내부 스크롤 영역 */}
        {fullTranscript && (
          <FullTranscriptSection>
            <FullTranscriptTitle>📄 전체 대본</FullTranscriptTitle>
            <TranscriptScrollArea>
              {parseContent(fullTranscript).map((line, lineIndex) => (
                <DialogLine key={lineIndex} $speaker={line.speaker}>
                  <SpeakerBadge $speaker={line.speaker}>
                    {line.speaker === "Person1" ? "🎙️ 진행자 1" : "🎧 진행자 2"}
                  </SpeakerBadge>
                  <DialogText>{line.text}</DialogText>
                </DialogLine>
              ))}
            </TranscriptScrollArea>
          </FullTranscriptSection>
        )}
      </TranscriptContainer>
    </Container>
  );
}

export default TranscriptPage;

// Styled Components
const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(to bottom, #f8f9fa 0%, #ffffff 100%);
  padding-bottom: 120px;
`;

const LoadingMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  color: #64748b;
  font-size: 1.125rem;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  gap: 1rem;
  padding: 2rem;
`;

const ErrorIcon = styled.div`
  font-size: 4rem;
  opacity: 0.5;
`;

const ErrorMessage = styled.p`
  color: #94a3b8;
  font-size: 1.125rem;
  text-align: center;
`;

const Header = styled.header`
  position: sticky;
  top: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  z-index: 100;
`;

const BackButton = styled.button`
  background: rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.1);
  color: #334155;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;

  &:hover {
    background: rgba(0, 0, 0, 0.1);
  }
`;

const HeaderTitle = styled.h1`
  color: #1e293b;
  font-size: 1.25rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const HeaderIcon = styled.span`
  font-size: 1.25rem;
`;

const TranscriptContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FullTranscriptSection = styled.div`
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 16px;
  padding: 1.25rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const FullTranscriptTitle = styled.h2`
  color: #1e293b;
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
`;

const TranscriptScrollArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 60vh;
  overflow-y: auto;
  padding-right: 0.5rem;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(6, 182, 212, 0.3);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(6, 182, 212, 0.5);
  }
`;

const DialogLine = styled.div<{ $speaker: "Person1" | "Person2" }>`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  background: ${(props) =>
    props.$speaker === "Person1"
      ? "rgba(102, 126, 234, 0.1)"
      : "rgba(6, 182, 212, 0.1)"};
  border-radius: 12px;
  border-left: 3px solid
    ${(props) => (props.$speaker === "Person1" ? "#667eea" : "#06b6d4")};
  margin-left: ${(props) => (props.$speaker === "Person2" ? "2rem" : "0")};
  margin-right: ${(props) => (props.$speaker === "Person1" ? "2rem" : "0")};

  @media (max-width: 768px) {
    margin-left: ${(props) => (props.$speaker === "Person2" ? "1rem" : "0")};
    margin-right: ${(props) => (props.$speaker === "Person1" ? "1rem" : "0")};
  }
`;

const SpeakerBadge = styled.span<{ $speaker: "Person1" | "Person2" }>`
  font-size: 0.8rem;
  font-weight: 700;
  color: ${(props) => (props.$speaker === "Person1" ? "#667eea" : "#06b6d4")};
`;

const DialogText = styled.p`
  margin: 0;
  color: #334155;
  font-size: 0.9375rem;
  line-height: 1.8;
`;
