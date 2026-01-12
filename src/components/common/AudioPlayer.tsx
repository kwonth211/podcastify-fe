import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

interface AudioPlayerProps {
  src: string;
  title?: string;
  dark?: boolean;
}

const PlayerContainer = styled.div<{ dark?: boolean }>`
  background: ${props => props.dark ? 'transparent' : 'white'};
  border-radius: 1rem;
  padding: ${props => props.dark ? '0' : '1.5rem'};
  box-shadow: ${props => props.dark ? 'none' : '0 10px 25px -5px rgba(0, 0, 0, 0.1)'};
  border: ${props => props.dark ? 'none' : '1px solid #e5e7eb'};
  max-width: 32rem;
  margin: 0 auto;
`;

const PlayerTitle = styled.h3<{ dark?: boolean }>`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.dark ? '#ffffff' : '#111827'};
  margin-bottom: 1rem;
  text-align: center;
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const PlayButton = styled.button`
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: #4f46e5;
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;

  &:hover {
    background: #4338ca;
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }

  svg {
    width: 1.5rem;
    height: 1.5rem;
  }
`;

const TimelineContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const TimelineWrapper = styled.div<{ dark?: boolean }>`
  position: relative;
  width: 100%;
  height: 0.5rem;
  background: ${props => props.dark ? 'rgba(255, 255, 255, 0.2)' : '#e5e7eb'};
  border-radius: 9999px;
  cursor: pointer;
  overflow: hidden;
`;

const TimelineProgress = styled.div<{ progress: number }>`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: ${props => props.progress}%;
  background: linear-gradient(to right, #4f46e5, #6366f1);
  border-radius: 9999px;
  transition: width 0.1s linear;
`;

const TimelineHandle = styled.div<{ progress: number }>`
  position: absolute;
  left: ${props => props.progress}%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 1rem;
  height: 1rem;
  background: #4f46e5;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  opacity: 0;
  transition: opacity 0.2s;

  ${TimelineWrapper}:hover & {
    opacity: 1;
  }
`;

const TimeDisplay = styled.div<{ dark?: boolean }>`
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: ${props => props.dark ? '#9ca3af' : '#6b7280'};
  font-variant-numeric: tabular-nums;
`;

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, title = 'Sample Podcast', dark = false }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

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
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleTimelineMouseDown = () => {
    setIsDragging(true);
  };

  const handleTimelineMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const audio = audioRef.current;
    if (!audio || !duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const newTime = percent * duration;
    
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleTimelineMouseUp = () => {
    setIsDragging(false);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <PlayerContainer dark={dark}>
      {title && <PlayerTitle dark={dark}>{title}</PlayerTitle>}
      <audio ref={audioRef} src={src} preload="metadata" />
      <Controls>
        <PlayButton onClick={togglePlay}>
          {isPlaying ? (
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          )}
        </PlayButton>
        <TimelineContainer>
          <TimelineWrapper
            dark={dark}
            onClick={handleTimelineClick}
            onMouseDown={handleTimelineMouseDown}
            onMouseMove={handleTimelineMouseMove}
            onMouseUp={handleTimelineMouseUp}
            onMouseLeave={handleTimelineMouseUp}
          >
            <TimelineProgress progress={progress} />
            <TimelineHandle progress={progress} />
          </TimelineWrapper>
          <TimeDisplay dark={dark}>
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </TimeDisplay>
        </TimelineContainer>
      </Controls>
    </PlayerContainer>
  );
};

export default AudioPlayer;
