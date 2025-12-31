import { useState, useEffect, useRef, useCallback } from "react";
import {
  useParams,
  useNavigate,
  useSearchParams,
  Link,
} from "react-router-dom";
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

  // 대본 라인 참조를 위한 ref
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);

  const date = extractDateFromKey(decodedKey);
  const formattedDate = date ? dayjs(date).format("YYYY년 M월 D일") : "";

  // 초기 시간 파라미터
  const initialTime = searchParams.get("t");

  // 현재 재생 시간, 전체 길이, 재생 속도 (전역 플레이어에서 가져옴)
  const isCurrentPodcast = playerState.podcastKey === decodedKey;
  const currentTime = isCurrentPodcast ? playerState.currentTime : 0;
  const duration = isCurrentPodcast ? playerState.duration : 0;
  const playbackRate = isCurrentPodcast ? playerState.playbackRate : 1;

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
        playPodcast(decodedKey, audioUrl, time);
      }
    }
  }, [audioUrl, initialTime, decodedKey, playPodcast]);

  // 타임라인 클릭 시 전역 플레이어로 재생
  const handleTimelineClick = (time: number) => {
    if (!audioUrl) return;
    playPodcast(decodedKey, audioUrl, time);
  };

  // 대본 라인 파싱 (메모이제이션)
  const transcriptLines = fullTranscript ? parseContent(fullTranscript) : [];

  // 특수문자, 마침표 등 제외하고 실제 읽히는 글자수만 계산
  const getReadableCharCount = (text: string): number => {
    // 한글, 영문, 숫자만 카운트 (특수문자, 공백, 마침표 등 제외)
    const readableChars = text.replace(/[^가-힣a-zA-Z0-9]/g, "");
    return readableChars.length;
  };

  // CPM(분당 글자수) 기반 활성 대본 라인 인덱스 계산
  const getActiveLineIndex = useCallback((): number => {
    if (transcriptLines.length === 0 || !isCurrentPodcast || duration <= 0) {
      return -1;
    }

    // 각 라인의 글자수 계산 (특수문자 제외)
    const charCounts = transcriptLines.map((line) =>
      getReadableCharCount(line.text)
    );
    const totalChars = charCounts.reduce((sum, count) => sum + count, 0);

    if (totalChars === 0) return 0;

    // 실제 CPM 계산 (전체 글자수 / 전체 시간(분))
    const actualCPM = totalChars / (duration / 60);
    // 초당 글자수 (CPS), 재생 속도 반영
    const CPS = (actualCPM / 60) * playbackRate;

    // 포커스가 음성보다 약간 앞서가도록 글자 오프셋 추가
    // 기준: 보통 속도 400 CPM = 약 6.67 글자/초, 0.4초분 ≈ 3글자
    // 빠르면 값 감소, 느리면 값 증가
    const CHAR_OFFSET = Math.round(CPS * 0.6); // 0.4초분의 글자수

    // 현재 시간까지 읽은 글자수 + 오프셋
    const charsRead = (currentTime / duration) * totalChars;
    const targetChars = Math.min(charsRead + CHAR_OFFSET, totalChars);

    // 누적 글자수로 현재 라인 찾기
    let cumulativeChars = 0;
    for (let i = 0; i < transcriptLines.length; i++) {
      cumulativeChars += charCounts[i];
      if (cumulativeChars >= targetChars) {
        return i;
      }
    }

    return transcriptLines.length - 1;
  }, [currentTime, duration, playbackRate, transcriptLines, isCurrentPodcast]);

  const activeLineIndex = getActiveLineIndex();

  // 활성 대본 라인으로 자동 스크롤
  useEffect(() => {
    if (activeLineIndex >= 0 && lineRefs.current[activeLineIndex]) {
      lineRefs.current[activeLineIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [activeLineIndex]);

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
        <title>
          {formattedDate} 뉴스 대본 - Daily News Podcast | AI 뉴스 요약
        </title>
        <meta
          name="description"
          content={`${formattedDate} Daily News Podcast 전체 대본입니다. AI가 요약한 오늘의 주요 뉴스를 텍스트로 확인하세요. 타임라인과 함께 원하는 부분을 바로 찾아볼 수 있습니다.`}
        />
        <meta
          name="keywords"
          content={`${formattedDate} 뉴스, 뉴스 대본, 팟캐스트 스크립트, AI 뉴스 요약, Daily News Podcast`}
        />
        <link
          rel="canonical"
          href={`https://dailynewspod.com/transcript/${encodeURIComponent(
            decodedKey
          )}`}
        />
        <meta
          property="og:title"
          content={`${formattedDate} 뉴스 대본 - Daily News Podcast`}
        />
        <meta
          property="og:description"
          content={`${formattedDate} Daily News Podcast 전체 대본. AI가 요약한 뉴스를 텍스트로 확인하세요.`}
        />
        <meta
          property="og:url"
          content={`https://dailynewspod.com/transcript/${encodeURIComponent(
            decodedKey
          )}`}
        />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="Daily News Podcast" />
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
        {/* 타임라인 - 클릭으로 해당 시간으로 이동 */}
        {timelineItems.length > 0 && (
          <Timeline
            items={timelineItems}
            currentTime={0}
            onTimeClick={handleTimelineClick}
            variant="card"
            maxHeight="280px"
          />
        )}

        {/* 전체 대본 - 내부 스크롤 영역 */}
        {transcriptLines.length > 0 && (
          <FullTranscriptSection>
            <FullTranscriptTitle>📄 전체 대본</FullTranscriptTitle>
            <TranscriptScrollArea ref={scrollAreaRef}>
              {transcriptLines.map((line, lineIndex) => {
                const isActive = lineIndex === activeLineIndex;
                return (
                  <DialogLine
                    key={lineIndex}
                    ref={(el) => {
                      lineRefs.current[lineIndex] = el;
                    }}
                    $speaker={line.speaker}
                    $isActive={isActive}
                  >
                    <SpeakerBadge $speaker={line.speaker}>
                      {line.speaker === "Person1"
                        ? "🎙️ 진행자 1"
                        : "🎧 진행자 2"}
                    </SpeakerBadge>
                    <DialogText>{line.text}</DialogText>
                    {isActive && <ActiveBadge>재생 중</ActiveBadge>}
                  </DialogLine>
                );
              })}
            </TranscriptScrollArea>
          </FullTranscriptSection>
        )}
      </TranscriptContainer>

      {/* Footer */}
      <TranscriptFooter>
        <FooterContent>
          <FooterLogo>
            <FooterLogoIcon>🎙️</FooterLogoIcon>
            <FooterLogoText>Daily News Podcast</FooterLogoText>
          </FooterLogo>
          <FooterLinks>
            <FooterLink to="/about">서비스 소개</FooterLink>
            <FooterDivider>|</FooterDivider>
            <FooterLink to="/contact">문의하기</FooterLink>
            <FooterDivider>|</FooterDivider>
            <FooterLink to="/privacy">개인정보처리방침</FooterLink>
            <FooterDivider>|</FooterDivider>
            <FooterLink to="/terms">이용약관</FooterLink>
          </FooterLinks>
          <FooterCopyright>
            © {new Date().getFullYear()} Daily News Podcast. All rights
            reserved.
          </FooterCopyright>
        </FooterContent>
      </TranscriptFooter>
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

const DialogLine = styled.div<{
  $speaker: "Person1" | "Person2";
  $isActive?: boolean;
}>`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  background: ${(props) =>
    props.$isActive
      ? props.$speaker === "Person1"
        ? "rgba(102, 126, 234, 0.25)"
        : "rgba(6, 182, 212, 0.25)"
      : props.$speaker === "Person1"
      ? "rgba(102, 126, 234, 0.1)"
      : "rgba(6, 182, 212, 0.1)"};
  border-radius: 12px;
  border-left: 4px solid
    ${(props) => (props.$speaker === "Person1" ? "#667eea" : "#06b6d4")};
  margin-left: ${(props) => (props.$speaker === "Person2" ? "2rem" : "0")};
  margin-right: ${(props) => (props.$speaker === "Person1" ? "2rem" : "0")};
  transition: all 0.3s ease;
  position: relative;

  ${(props) =>
    props.$isActive &&
    `
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
    transform: scale(1.01);
    border-left-width: 5px;
  `}

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

const ActiveBadge = styled.span`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  font-size: 0.7rem;
  font-weight: 600;
  color: #667eea;
  background: rgba(102, 126, 234, 0.15);
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  animation: pulse 1.5s ease-in-out infinite;

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`;

const TranscriptFooter = styled.footer`
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-top: 1px solid #e2e8f0;
  padding: 2rem 1.5rem;
  margin-top: 2rem;
`;

const FooterContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  text-align: center;
`;

const FooterLogo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FooterLogoIcon = styled.span`
  font-size: 1.25rem;
`;

const FooterLogoText = styled.span`
  font-size: 1rem;
  font-weight: 700;
  color: #334155;
`;

const FooterLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: center;

  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

const FooterLink = styled(Link)`
  color: #64748b;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: color 0.2s;

  &:hover {
    color: #667eea;
  }
`;

const FooterDivider = styled.span`
  color: #cbd5e1;
  font-size: 0.75rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const FooterCopyright = styled.p`
  font-size: 0.75rem;
  color: #94a3b8;
  margin: 0;
`;
