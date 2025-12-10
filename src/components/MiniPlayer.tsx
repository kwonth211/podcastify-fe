import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import dayjs from "dayjs";
import * as analytics from "../utils/analytics";

// podcastKey에서 날짜 추출 (파일명 끝의 _YYYYMMDD 패턴)
const extractDateFromKey = (key: string): string | null => {
  const match = key.match(/_(\d{4})(\d{2})(\d{2})\./);
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`;
  }
  return null;
};

interface MiniPlayerProps {
  audioUrl: string;
  podcastKey: string;
  onClose: () => void;
  initialSeekTime?: number;
  onTimeUpdate?: (time: number) => void;
  onDurationUpdate?: (duration: number) => void;
  onPlaybackRateChange?: (rate: number) => void;
  onSeekComplete?: () => void;
}

function MiniPlayer({
  audioUrl,
  podcastKey,
  onClose,
  initialSeekTime,
  onTimeUpdate,
  onDurationUpdate,
  onPlaybackRateChange,
  onSeekComplete,
}: MiniPlayerProps) {
  // podcastKey에서 날짜 추출 및 포맷팅
  const title = (() => {
    const date = extractDateFromKey(podcastKey);
    return date ? dayjs(date).format("M/D") : "";
  })();
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragProgress, setDragProgress] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);

  // 마운트 시 애니메이션
  useEffect(() => {
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  }, []);

  // 새 팟캐스트 로드 시 재생 카운트
  useEffect(() => {
    if (!podcastKey) return;

    fetch("/api/count", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: podcastKey }),
    }).catch(() => {});
  }, [podcastKey]);

  // 오디오 이벤트 핸들러
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      if (!isDragging) {
        setCurrentTime(audio.currentTime);
        onTimeUpdate?.(audio.currentTime);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      onDurationUpdate?.(audio.duration);

      // 초기 시작 시간이 있으면 해당 위치로 이동
      if (initialSeekTime !== undefined && initialSeekTime > 0) {
        audio.currentTime = initialSeekTime;
        onSeekComplete?.();
      }

      // 자동 재생
      audio.play().catch((err) => {
        if (err.name !== "NotAllowedError") {
          console.error("자동 재생 실패:", err);
        }
      });
    };

    const handleEnded = () => {
      setIsPlaying(false);
      // GA 이벤트: 팟캐스트 재생 완료
      if (podcastKey) {
        analytics.trackPodcastComplete(podcastKey, title);
      }
    };
    const handlePlay = () => {
      setIsPlaying(true);
      // GA 이벤트: 팟캐스트 재생 시작
      if (podcastKey) {
        analytics.trackPodcastPlay(podcastKey, title, audio.duration);
      }
    };
    const handlePause = () => {
      setIsPlaying(false);
      // GA 이벤트: 팟캐스트 일시정지
      if (podcastKey) {
        analytics.trackPodcastPause(podcastKey, title, audio.currentTime);
      }
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
    };
  }, [
    audioUrl,
    isDragging,
    onTimeUpdate,
    onDurationUpdate,
    initialSeekTime,
    onSeekComplete,
  ]);

  // initialSeekTime 변경 시 해당 시간으로 이동 (이미 로드된 오디오에서)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || initialSeekTime === undefined) return;

    // 오디오가 이미 로드된 상태에서만 실행
    if (audio.readyState >= 2 && audio.duration > 0) {
      audio.currentTime = initialSeekTime;
      audio.play().catch(() => {});
      onSeekComplete?.();
    }
  }, [initialSeekTime, onSeekComplete]);

  // 드래그 이벤트 핸들러
  const getProgressFromEvent = useCallback(
    (clientX: number) => {
      if (!progressBarRef.current || !duration) return 0;
      const rect = progressBarRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, x / rect.width));
      return percentage;
    },
    [duration]
  );

  const handleDragStart = useCallback(
    (clientX: number) => {
      setIsDragging(true);
      const progress = getProgressFromEvent(clientX);
      setDragProgress(progress);
    },
    [getProgressFromEvent]
  );

  const handleDragMove = useCallback(
    (clientX: number) => {
      if (!isDragging) return;
      const progress = getProgressFromEvent(clientX);
      setDragProgress(progress);
    },
    [isDragging, getProgressFromEvent]
  );

  const handleDragEnd = useCallback(() => {
    if (!isDragging || !audioRef.current || !duration) return;
    const newTime = dragProgress * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
    setIsDragging(false);
  }, [isDragging, dragProgress, duration]);

  // 마우스 이벤트
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      handleDragStart(e.clientX);
    },
    [handleDragStart]
  );

  // 터치 이벤트
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      handleDragStart(e.touches[0].clientX);
    },
    [handleDragStart]
  );

  // 전역 이벤트 리스너 (드래그 중)
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => handleDragMove(e.clientX);
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handleDragMove(e.touches[0].clientX);
      }
    };
    const handleEnd = () => handleDragEnd();

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleEnd);
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleEnd);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleEnd);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleEnd);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
  }, [isPlaying]);

  const skipBackward = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, audio.currentTime - 10);
  }, []);

  const skipForward = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.min(duration, audio.currentTime + 10);
  }, [duration]);

  const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2];

  const handleSpeedChange = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const currentIndex = speedOptions.indexOf(playbackRate);
    const nextIndex = (currentIndex + 1) % speedOptions.length;
    const newRate = speedOptions[nextIndex];

    setPlaybackRate(newRate);
    audio.playbackRate = newRate;
    onPlaybackRateChange?.(newRate);
  }, [playbackRate, onPlaybackRateChange]);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      onClose();
    }, 200);
  }, [onClose]);

  const handleTranscript = useCallback(() => {
    if (podcastKey) {
      // GA 이벤트: 대본 보기 클릭
      analytics.trackTranscriptView(podcastKey, title);
      analytics.trackButtonClick("transcript_button", "mini_player");

      const timeParam = currentTime > 0 ? `?t=${Math.floor(currentTime)}` : "";
      navigate(`/transcript/${encodeURIComponent(podcastKey)}${timeParam}`);
    }
  }, [podcastKey, currentTime, navigate, title]);

  const progress = isDragging
    ? dragProgress * 100
    : duration
    ? (currentTime / duration) * 100
    : 0;

  return (
    <Container $visible={isVisible}>
      <ProgressBarTop
        ref={progressBarRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        $isDragging={isDragging}
      >
        <ProgressFill
          $isDragging={isDragging}
          style={{ width: `${progress}%` }}
        />
        <ProgressHandle
          $isDragging={isDragging}
          style={{ left: `${progress}%` }}
        />
      </ProgressBarTop>

      <Content onClick={handleTranscript} title="대본 보기">
        <InfoSection>
          <PodcastIcon $isPlaying={isPlaying}>
            <IconEmoji>🎙️</IconEmoji>
          </PodcastIcon>
          <TextInfo>
            <Title>{title}</Title>
            <TranscriptHint>탭하여 대본 보기</TranscriptHint>
          </TextInfo>
        </InfoSection>

        <ControlsSection onClick={(e) => e.stopPropagation()}>
          <SkipButton onClick={skipBackward} aria-label="10초 뒤로">
            <SkipIconWrapper>
              <SkipSvg viewBox="0 0 24 24" $direction="backward">
                <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
              </SkipSvg>
              <SkipNumber>10</SkipNumber>
            </SkipIconWrapper>
          </SkipButton>

          <PlayButton onClick={togglePlay} $isPlaying={isPlaying}>
            {isPlaying ? (
              <PauseIcon viewBox="0 0 24 24">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </PauseIcon>
            ) : (
              <PlayIcon viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </PlayIcon>
            )}
          </PlayButton>

          <SkipButton onClick={skipForward} aria-label="10초 앞으로">
            <SkipIconWrapper>
              <SkipSvg viewBox="0 0 24 24" $direction="forward">
                <path d="M12 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8z" />
              </SkipSvg>
              <SkipNumber>10</SkipNumber>
            </SkipIconWrapper>
          </SkipButton>

          <SpeedButton onClick={handleSpeedChange} title="배속 변경">
            {playbackRate}x
          </SpeedButton>

          <CloseButton onClick={handleClose} aria-label="닫기">
            <CloseSvg viewBox="0 0 24 24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </CloseSvg>
          </CloseButton>
        </ControlsSection>
      </Content>

      <audio ref={audioRef} key={audioUrl} src={audioUrl} preload="metadata" />
    </Container>
  );
}

export default MiniPlayer;

// Styled Components
const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

const Container = styled.div<{ $visible: boolean }>`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.08);
  z-index: 1000;
  transform: translateY(${(props) => (props.$visible ? "0" : "100%")});
  opacity: ${(props) => (props.$visible ? 1 : 0)};
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1);

  /* Safe area for iOS */
  padding-bottom: env(safe-area-inset-bottom, 0);

  @media (min-width: 768px) {
    left: 50%;
    transform: translateX(-50%)
      translateY(${(props) => (props.$visible ? "0" : "100%")});
    max-width: 640px;
    border-radius: 16px 16px 0 0;
    bottom: 0;
  }
`;

const ProgressBarTop = styled.div<{ $isDragging: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: ${(props) => (props.$isDragging ? "8px" : "4px")};
  background: rgba(102, 126, 234, 0.15);
  cursor: pointer;
  overflow: visible;
  transition: height 0.15s ease;
  touch-action: none;

  &:hover {
    height: 8px;
  }
`;

const ProgressFill = styled.div<{ $isDragging: boolean }>`
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  transition: ${(props) => (props.$isDragging ? "none" : "width 0.1s linear")};
  pointer-events: none;
`;

const ProgressHandle = styled.div<{ $isDragging: boolean }>`
  position: absolute;
  top: 50%;
  width: 14px;
  height: 14px;
  background: #667eea;
  border-radius: 50%;
  transform: translate(-50%, -50%)
    ${(props) => (props.$isDragging ? "scale(1.2)" : "scale(1)")};
  box-shadow: 0 2px 6px rgba(102, 126, 234, 0.4);
  opacity: ${(props) => (props.$isDragging ? 1 : 0)};
  transition: ${(props) =>
    props.$isDragging ? "none" : "opacity 0.15s ease, transform 0.15s ease"};
  pointer-events: none;
  will-change: left;

  ${ProgressBarTop}:hover & {
    opacity: 1;
  }
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1rem;
  gap: 0.75rem;
  cursor: pointer;

  @media (min-width: 768px) {
    padding: 1.125rem 1.5rem;
  }
`;

const InfoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
  min-width: 0;
`;

const PodcastIcon = styled.div<{ $isPlaying: boolean }>`
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  animation: ${(props) => (props.$isPlaying ? pulse : "none")} 2s ease-in-out
    infinite;

  @media (min-width: 768px) {
    width: 48px;
    height: 48px;
    border-radius: 12px;
  }
`;

const IconEmoji = styled.span`
  font-size: 1.25rem;
  filter: grayscale(0) brightness(1.1);

  @media (min-width: 768px) {
    font-size: 1.5rem;
  }
`;

const TextInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const Title = styled.p`
  margin: 0;
  font-size: 0.9375rem;
  font-weight: 600;
  color: #1f2937;
  line-height: 1.3;

  @media (min-width: 768px) {
    font-size: 1rem;
  }
`;

const TranscriptHint = styled.span`
  display: block;
  font-size: 0.6875rem;
  color: #9ca3af;
  margin-top: 0.125rem;
`;

const ControlsSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;

  @media (min-width: 768px) {
    gap: 0.5rem;
  }
`;

const SkipButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  color: #4b5563;
  cursor: pointer;
  border-radius: 50%;
  transition: all 0.15s ease;
  padding: 0;

  &:hover {
    background: rgba(0, 0, 0, 0.06);
    color: #1f2937;
  }

  &:active {
    transform: scale(0.9);
    background: rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 360px) {
    width: 32px;
    height: 32px;
  }
`;

const SkipIconWrapper = styled.div`
  position: relative;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SkipSvg = styled.svg<{ $direction: "forward" | "backward" }>`
  width: 28px;
  height: 28px;
  fill: currentColor;
`;

const SkipNumber = styled.span`
  position: absolute;
  font-size: 0.5rem;
  font-weight: 700;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin-top: 1px;
`;

const PlayButton = styled.button<{ $isPlaying: boolean }>`
  width: 46px;
  height: 46px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px rgba(102, 126, 234, 0.35);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 0;

  &:hover {
    transform: scale(1.08);
    box-shadow: 0 4px 16px rgba(102, 126, 234, 0.45);
  }

  &:active {
    transform: scale(0.95);
  }

  @media (min-width: 768px) {
    width: 50px;
    height: 50px;
  }
`;

const PlayIcon = styled.svg`
  width: 22px;
  height: 22px;
  fill: white;
  margin-left: 2px;
`;

const PauseIcon = styled.svg`
  width: 20px;
  height: 20px;
  fill: white;
`;

const SpeedButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 28px;
  padding: 0 8px;
  border: 1px solid #e5e7eb;
  background: white;
  color: #4b5563;
  cursor: pointer;
  border-radius: 14px;
  transition: all 0.15s ease;
  font-size: 0.75rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;

  &:hover {
    background: rgba(102, 126, 234, 0.1);
    border-color: #667eea;
    color: #667eea;
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 360px) {
    min-width: 36px;
    height: 26px;
    font-size: 0.7rem;
  }
`;

const CloseButton = styled.button`
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  color: #9ca3af;
  cursor: pointer;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
  margin-left: 0.125rem;
  padding: 0;

  &:hover {
    background: rgba(0, 0, 0, 0.06);
    color: #4b5563;
  }

  &:active {
    transform: scale(0.9);
  }
`;

const CloseSvg = styled.svg`
  width: 18px;
  height: 18px;
  fill: currentColor;
`;
