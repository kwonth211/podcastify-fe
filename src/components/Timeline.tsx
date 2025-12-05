import { useState, useEffect, useCallback } from "react";
import styled from "styled-components";

export interface TimelineItem {
  time: number; // seconds
  label: string;
}

export interface TimelineProps {
  podcastKey?: string;
  currentTime: number;
  onTimeClick: (time: number) => void;
}

const TimelineContainer = styled.div`
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(6, 182, 212, 0.2);
`;

const TimelineHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: #0f172a;
  opacity: 0.9;
`;

const TimelineIcon = styled.span`
  font-size: 1rem;
`;

const TimelineList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 300px;
  overflow-y: auto;
  padding-right: 0.5rem;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(6, 182, 212, 0.1);
    border-radius: 2px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(6, 182, 212, 0.3);
    border-radius: 2px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(6, 182, 212, 0.5);
  }
`;

interface TimelineItemStyledProps {
  $isActive: boolean;
}

const TimelineItemStyled = styled.button<TimelineItemStyledProps>`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem;
  background: ${(props) =>
    props.$isActive ? "rgba(6, 182, 212, 0.2)" : "rgba(6, 182, 212, 0.05)"};
  border: 1px solid
    ${(props) =>
      props.$isActive ? "rgba(6, 182, 212, 0.4)" : "rgba(6, 182, 212, 0.15)"};
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  width: 100%;

  &:hover {
    background: rgba(6, 182, 212, 0.15);
    border-color: rgba(6, 182, 212, 0.3);
    transform: translateX(4px);
  }

  &:active {
    transform: translateX(2px);
  }
`;

const TimelineTime = styled.span`
  font-family: "SF Mono", "Monaco", "Inconsolata", "Fira Mono", monospace;
  font-size: 0.8rem;
  font-weight: 600;
  color: #0891b2;
  background: rgba(6, 182, 212, 0.15);
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  white-space: nowrap;
  min-width: 52px;
  text-align: center;
`;

const TimelineLabel = styled.span`
  font-size: 0.85rem;
  color: #0f172a;
  line-height: 1.4;
  flex: 1;
`;

// podcastKey에서 timeline 파일 키 생성
const getTimelineKey = (key: string): string => {
  // 예: 39-19842753052_podcast_20251202.mp3 -> 39-19842753052_timeline_20251202.txt
  return key.replace("_podcast_", "_timeline_").replace(".mp3", ".txt");
};

// 타임라인 텍스트 파싱
const parseTimeline = (text: string): TimelineItem[] => {
  const lines = text.split("\n");
  const items: TimelineItem[] = [];

  for (const line of lines) {
    // [MM:SS] 형식 매칭
    const match = line.match(/^\[(\d{1,2}):(\d{2})\]\s*(.+)$/);
    if (match) {
      const minutes = parseInt(match[1], 10);
      const seconds = parseInt(match[2], 10);
      const label = match[3].trim();
      items.push({
        time: minutes * 60 + seconds,
        label,
      });
    }
  }

  return items;
};

// 시간을 MM:SS 형식으로 포맷
const formatTimelineTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};

function Timeline({ podcastKey, currentTime, onTimeClick }: TimelineProps) {
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);

  // 타임라인 파일 fetch
  useEffect(() => {
    if (!podcastKey) {
      setTimeline([]);
      return;
    }

    const timelineKey = getTimelineKey(podcastKey);
    const publicUrl = import.meta.env.VITE_R2_PUBLIC_URL;

    if (!publicUrl) {
      setTimeline([]);
      return;
    }

    const timelineUrl = `${publicUrl}/${timelineKey}`;

    fetch(timelineUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Timeline not found");
        }
        return response.text();
      })
      .then((text) => {
        const items = parseTimeline(text);
        setTimeline(items);
      })
      .catch(() => {
        // 파일이 없으면 빈 배열
        setTimeline([]);
      });
  }, [podcastKey]);

  // 현재 재생 중인 타임라인 항목 찾기
  const getActiveTimelineIndex = useCallback((): number => {
    if (timeline.length === 0) return -1;

    for (let i = timeline.length - 1; i >= 0; i--) {
      if (currentTime >= timeline[i].time) {
        return i;
      }
    }
    return -1;
  }, [timeline, currentTime]);

  // 타임라인이 없으면 렌더링하지 않음
  if (timeline.length === 0) {
    return null;
  }

  return (
    <TimelineContainer>
      <TimelineHeader>
        <TimelineIcon>📋</TimelineIcon>
        타임라인
      </TimelineHeader>
      <TimelineList>
        {timeline.map((item, index) => (
          <TimelineItemStyled
            key={index}
            $isActive={getActiveTimelineIndex() === index}
            onClick={() => onTimeClick(item.time)}
          >
            <TimelineTime>{formatTimelineTime(item.time)}</TimelineTime>
            <TimelineLabel>{item.label}</TimelineLabel>
          </TimelineItemStyled>
        ))}
      </TimelineList>
    </TimelineContainer>
  );
}

export default Timeline;

