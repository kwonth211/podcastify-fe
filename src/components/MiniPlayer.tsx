import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";

interface MiniPlayerProps {
  audioUrl: string;
  title: string;
  podcastKey?: string;
  onClose: () => void;
  initialSeekTime?: number;
  onTimeUpdate?: (time: number) => void;
  onSeekComplete?: () => void;
}

function MiniPlayer({
  audioUrl,
  title,
  podcastKey,
  onClose,
  initialSeekTime,
  onTimeUpdate,
  onSeekComplete,
}: MiniPlayerProps) {
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragProgress, setDragProgress] = useState(0);

  // 마운트 시 애니메이션
  useEffect(() => {
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  }, []);

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

    const handleEnded = () => setIsPlaying(false);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

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
  }, [audioUrl, isDragging, onTimeUpdate, initialSeekTime, onSeekComplete]);

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
    audio.currentTime = Math.max(0, audio.currentTime - 15);
  }, []);

  const skipForward = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.min(duration, audio.currentTime + 15);
  }, [duration]);

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
      const timeParam = currentTime > 0 ? `?t=${Math.floor(currentTime)}` : "";
      navigate(`/transcript/${encodeURIComponent(podcastKey)}${timeParam}`);
    }
  }, [podcastKey, currentTime, navigate]);

  const formatTime = (seconds: number): string => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = isDragging
    ? dragProgress * 100
    : duration
    ? (currentTime / duration) * 100
    : 0;

  const displayTime = isDragging ? dragProgress * duration : currentTime;

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

      <Content>
        <InfoSection>
          <PodcastIcon $isPlaying={isPlaying}>
            <IconEmoji>🎙️</IconEmoji>
          </PodcastIcon>
          <TextInfo>
            <Title>{title}</Title>
            <TimeText>
              {formatTime(displayTime)} / {formatTime(duration)}
            </TimeText>
          </TextInfo>
        </InfoSection>

        <ControlsSection>
          <SkipButton onClick={skipBackward} aria-label="15초 뒤로">
            <SkipIconWrapper>
              <SkipSvg viewBox="0 0 24 24" $direction="backward">
                <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
              </SkipSvg>
              <SkipNumber>15</SkipNumber>
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

          <SkipButton onClick={skipForward} aria-label="15초 앞으로">
            <SkipIconWrapper>
              <SkipSvg viewBox="0 0 24 24" $direction="forward">
                <path d="M12 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8z" />
              </SkipSvg>
              <SkipNumber>15</SkipNumber>
            </SkipIconWrapper>
          </SkipButton>

          <TranscriptButton onClick={handleTranscript} title="대본 보기">
            <TranscriptIcon viewBox="0 0 24 24">
              <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM4 12h4v2H4v-2zm10 6H4v-2h10v2zm6 0h-4v-2h4v2zm0-4H10v-2h10v2z" />
            </TranscriptIcon>
            <TranscriptLabel>대본</TranscriptLabel>
          </TranscriptButton>

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
  padding: 0.75rem 1rem;
  gap: 0.75rem;

  @media (min-width: 768px) {
    padding: 0.875rem 1.5rem;
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

const TimeText = styled.p`
  margin: 0;
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
  margin-top: 0.125rem;
  font-variant-numeric: tabular-nums;
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
  width: 40px;
  height: 40px;
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

  @media (max-width: 400px) {
    display: none;
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

const TranscriptButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  height: 32px;
  padding: 0 10px;
  border: 1px solid #e5e7eb;
  background: white;
  color: #4b5563;
  cursor: pointer;
  border-radius: 16px;
  transition: all 0.15s ease;
  font-size: 0.75rem;
  font-weight: 600;

  &:hover {
    background: rgba(102, 126, 234, 0.1);
    border-color: #667eea;
    color: #667eea;
  }

  @media (max-width: 360px) {
    display: none;
  }
`;

const TranscriptIcon = styled.svg`
  width: 14px;
  height: 14px;
  fill: currentColor;
`;

const TranscriptLabel = styled.span`
  white-space: nowrap;
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
