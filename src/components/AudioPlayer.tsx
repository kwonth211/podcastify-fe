import { useState, useRef, useEffect, useCallback } from "react";
import styled from "styled-components";
import type { AudioPlayerProps } from "../types";
import Timeline from "./Timeline";

const PlayerContainer = styled.div`
  background: linear-gradient(
    135deg,
    rgba(6, 182, 212, 0.15) 0%,
    rgba(8, 145, 178, 0.2) 100%
  );
  border-radius: 20px;
  padding: 2rem;
  color: #0f172a;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  margin-bottom: 0;
  border: 1px solid rgba(6, 182, 212, 0.2);
  backdrop-filter: blur(10px);

  @media (max-width: 768px) {
    padding: 1.5rem;
    border-radius: 16px;
  }
`;

const PlayerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  gap: 1rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    margin-bottom: 1rem;
    gap: 0.75rem;
  }
`;

const HeaderRight = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

const Title = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const DateLabel = styled.span`
  font-size: 0.9rem;
  opacity: 0.8;
  background: rgba(6, 182, 212, 0.15);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  color: #0f172a;
  border: 1px solid rgba(6, 182, 212, 0.2);
`;

const PlayCountBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.75rem;
  opacity: 0.9;
  background: rgba(6, 182, 212, 0.1);
  padding: 0.35rem 0.7rem;
  border-radius: 12px;
  backdrop-filter: blur(8px);
  transition: all 0.2s ease;
  font-weight: 500;
  border: 1px solid rgba(6, 182, 212, 0.2);
  color: #0f172a;

  &:hover {
    background: rgba(6, 182, 212, 0.15);
  }
`;

const PlayCountIcon = styled.span`
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  opacity: 0.9;
`;

const PlayCountNumber = styled.span`
  font-weight: 600;
  letter-spacing: 0.01em;
  font-size: 0.75rem;
`;

const AudioElement = styled.audio`
  width: 100%;
  margin-bottom: 1rem;

  &::-webkit-media-controls-panel {
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
  }
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 0.75rem;
    margin-top: 0.75rem;
  }
`;

const ControlGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SpeedButton = styled.button`
  background: rgba(6, 182, 212, 0.1);
  color: #0f172a;
  border: 1px solid rgba(6, 182, 212, 0.2);
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(6, 182, 212, 0.2);
    border-color: rgba(6, 182, 212, 0.3);
  }

  &.active {
    background: rgba(6, 182, 212, 0.25);
    color: #0891b2;
    border-color: rgba(6, 182, 212, 0.4);
  }
`;

const DownloadButton = styled.button`
  background: rgba(6, 182, 212, 0.1);
  color: #0f172a;
  border: 1px solid rgba(6, 182, 212, 0.2);
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: rgba(6, 182, 212, 0.2);
    border-color: rgba(6, 182, 212, 0.3);
  }
`;

const PlayButton = styled.button`
  background: rgba(6, 182, 212, 0.2);
  color: #0891b2;
  border: 1px solid rgba(6, 182, 212, 0.3);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const TimeInfo = styled.div`
  flex: 1;
  font-size: 0.9rem;
  opacity: 0.9;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
  margin-top: 1rem;
  cursor: pointer;
  position: relative;
`;

interface ProgressProps {
  progress: number;
}

const Progress = styled.div<ProgressProps>`
  height: 100%;
  background: white;
  border-radius: 3px;
  width: ${(props) => props.progress}%;
  transition: width 0.1s;
`;

function AudioPlayer({
  audioUrl,
  date,
  title = "Daily News Podcast",
  duration: propDuration,
  onDownload,
  podcastKey,
  playCount,
  onPlayCountUpdate,
  triggerPlay,
  initialSeekTime,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const hasCountedRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);

  // 타임라인 항목 클릭 시 해당 시간으로 이동
  const handleTimelineClick = useCallback(
    (time: number) => {
      const audio = audioRef.current;
      if (!audio) return;

      audio.currentTime = time;
      if (!isPlaying) {
        audio.play().catch((err) => {
          if (err.name !== "NotAllowedError") {
            console.error("재생 실패:", err);
          }
        });
      }
    },
    [isPlaying]
  );

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // audioUrl이 변경되면 카운팅 플래그 리셋
    hasCountedRef.current = false;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);
    const handlePlay = () => {
      setIsPlaying(true);

      // 재생 시 한 번만 카운팅 (unique)
      if (!podcastKey || hasCountedRef.current) return;

      // 로컬스토리지에서 이미 재생한 팟캐스트인지 확인
      const playedKey = `played_${podcastKey}`;
      const hasPlayed = localStorage.getItem(playedKey);

      if (hasPlayed) return;

      hasCountedRef.current = true;
      localStorage.setItem(playedKey, "true");

      // 카운트 증가
      fetch("/api/count", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ key: podcastKey }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.count !== undefined) {
            onPlayCountUpdate?.(data.count);
          }
        })
        .catch((err) => {
          console.error("카운트 증가 실패:", err);
          // 실패 시 로컬스토리지에서 제거하여 재시도 가능하게
          localStorage.removeItem(playedKey);
          hasCountedRef.current = false;
        });
    };
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    // 배속 설정
    audio.playbackRate = playbackRate;

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
    };
  }, [audioUrl, playbackRate, podcastKey, onPlayCountUpdate]);

  // audioUrl이 변경되면 자동으로 재생
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audioUrl) return;

    const playAudio = async () => {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (err: any) {
        // 브라우저 자동 재생 정책으로 인한 실패는 조용히 처리
        // 사용자가 재생 버튼을 클릭할 수 있도록 UI는 그대로 유지
        if (err.name !== "NotAllowedError") {
          console.error("자동 재생 실패:", err);
        }
      }
    };

    playAudio();
  }, [audioUrl]);

  // triggerPlay가 변경되면 재생
  useEffect(() => {
    if (triggerPlay !== undefined && triggerPlay > 0 && audioRef.current) {
      const audio = audioRef.current;
      audio.play().catch((err) => {
        // 브라우저 자동 재생 정책으로 인한 실패는 조용히 처리
        // 사용자가 재생 버튼을 클릭할 수 있도록 UI는 그대로 유지
        if (err.name !== "NotAllowedError") {
          console.error("재생 실패:", err);
        }
      });
    }
  }, [triggerPlay]);

  // initialSeekTime이 변경되면 해당 시간으로 이동 후 재생
  useEffect(() => {
    if (
      initialSeekTime !== undefined &&
      initialSeekTime > 0 &&
      audioRef.current
    ) {
      const audio = audioRef.current;
      audio.currentTime = initialSeekTime;
      audio.play().catch((err) => {
        if (err.name !== "NotAllowedError") {
          console.error("재생 실패:", err);
        }
      });
    }
  }, [initialSeekTime]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds: number): string => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatCount = (count: number | null): string => {
    if (count === null) return "—";
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toLocaleString();
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    audio.currentTime = percentage * duration;
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackRate(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  };

  const handleDownload = async () => {
    if (onDownload) {
      onDownload();
    } else {
      // fallback: fetch로 다운로드
      try {
        const response = await fetch(audioUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${title.replace(/\s+/g, "_")}.mp3`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (err) {
        console.error("다운로드 실패:", err);
        // 최종 fallback: 새 창에서 열기
        window.open(audioUrl, "_blank");
      }
    }
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;
  const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2];

  return (
    <PlayerContainer>
      <PlayerHeader>
        <Title>{title}</Title>
        <HeaderRight>
          <PlayCountBadge>
            <PlayCountIcon>▶️</PlayCountIcon>
            <PlayCountNumber>{formatCount(playCount || 0)}</PlayCountNumber>
          </PlayCountBadge>
          <DateLabel>{date}</DateLabel>
        </HeaderRight>
      </PlayerHeader>

      <AudioElement ref={audioRef} src={audioUrl} preload="metadata" />

      <ProgressBar onClick={handleProgressClick}>
        <Progress progress={progress} />
      </ProgressBar>

      <Controls>
        <ControlGroup>
          <PlayButton onClick={togglePlay}>{isPlaying ? "⏸" : "▶"}</PlayButton>
          <TimeInfo>
            {formatTime(currentTime)} / {formatTime(propDuration || duration)}
          </TimeInfo>
        </ControlGroup>

        <ControlGroup>
          <SpeedButton
            onClick={() => {
              const currentIndex = speedOptions.indexOf(playbackRate);
              const nextIndex = (currentIndex + 1) % speedOptions.length;
              handleSpeedChange(speedOptions[nextIndex]);
            }}
            className="active"
            title="배속 변경 (클릭)"
          >
            {playbackRate}x
          </SpeedButton>
          <DownloadButton onClick={handleDownload} title="다운로드">
            ⬇ 다운로드
          </DownloadButton>
        </ControlGroup>
      </Controls>

      <Timeline
        podcastKey={podcastKey}
        currentTime={currentTime}
        onTimeClick={handleTimelineClick}
      />
    </PlayerContainer>
  );
}

export default AudioPlayer;
