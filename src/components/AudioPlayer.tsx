import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import type { AudioPlayerProps } from "../types";

const PlayerContainer = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 2rem;
  color: white;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  margin-bottom: 0;
`;

const PlayerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
`;

const DateLabel = styled.span`
  font-size: 0.9rem;
  opacity: 0.9;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 20px;
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
`;

const ControlGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SpeedButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  &.active {
    background: white;
    color: #667eea;
    border-color: white;
  }
`;

const DownloadButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const PlayButton = styled.button`
  background: white;
  color: #667eea;
  border: none;
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
  onDownload,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);
    const handlePlay = () => setIsPlaying(true);
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
  }, [audioUrl, playbackRate]);

  // audioUrl이 변경되면 자동으로 재생
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audioUrl) return;

    const playAudio = async () => {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (err) {
        console.error("자동 재생 실패:", err);
        // 브라우저 정책으로 인해 자동 재생이 차단될 수 있음
      }
    };

    playAudio();
  }, [audioUrl]);

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
        <DateLabel>{date}</DateLabel>
      </PlayerHeader>

      <AudioElement ref={audioRef} src={audioUrl} preload="metadata" />

      <ProgressBar onClick={handleProgressClick}>
        <Progress progress={progress} />
      </ProgressBar>

      <Controls>
        <ControlGroup>
          <PlayButton onClick={togglePlay}>{isPlaying ? "⏸" : "▶"}</PlayButton>
          <TimeInfo>
            {formatTime(currentTime)} / {formatTime(duration)}
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
    </PlayerContainer>
  );
}

export default AudioPlayer;
