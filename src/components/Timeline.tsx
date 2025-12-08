import { useState, useEffect, useCallback, useRef } from "react";
import styled from "styled-components";

export interface TimelineItem {
  time: number; // seconds
  label: string;
}

export interface TimelineProps {
  podcastKey?: string;
  currentTime: number;
  onTimeClick: (time: number) => void;
  items?: TimelineItem[]; // 외부에서 직접 전달 가능
  variant?: "default" | "compact" | "card"; // 스타일 변형
  maxHeight?: string; // 최대 높이
  showHeader?: boolean; // 헤더 표시 여부
  showActiveIndicator?: boolean; // 활성 표시기 표시 여부
  maxItems?: number; // 표시할 최대 항목 수 (축소 모드)
  isExpanded?: boolean; // 펼침 상태
}

// podcastKey에서 timeline 파일 키 생성
export const getTimelineKey = (key: string): string => {
  const fileName = key.includes("/") ? key.split("/").pop()! : key;
  return fileName.replace("_podcast_", "_timeline_").replace(".mp3", ".txt");
};

// 타임라인 텍스트 파싱
export const parseTimeline = (text: string): TimelineItem[] => {
  const lines = text.split("\n");
  const items: TimelineItem[] = [];

  for (const line of lines) {
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
export const formatTimelineTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};

// 타임라인 fetch 훅
export const useTimelineData = (podcastKey?: string) => {
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(false);

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

    setLoading(true);
    const timelineUrl = `${publicUrl}/${timelineKey}`;

    fetch(timelineUrl)
      .then((response) => {
        if (!response.ok) throw new Error("Timeline not found");
        return response.text();
      })
      .then((text) => {
        setTimeline(parseTimeline(text));
      })
      .catch(() => {
        setTimeline([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [podcastKey]);

  return { timeline, loading };
};

// Styled Components
const TimelineContainer = styled.div<{
  $variant: string;
  $isExpanded?: boolean;
}>`
  ${(props) =>
    props.$variant === "card"
      ? `
    background: white;
    border: 1px solid rgba(0, 0, 0, 0.08);
    border-radius: 16px;
    padding: 1.25rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  `
      : props.$variant === "compact"
      ? `
    margin-top: 1rem;
    padding: 1rem;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    border-radius: 12px;
    border: 1px solid ${
      props.$isExpanded ? "rgba(6, 182, 212, 0.25)" : "rgba(0, 0, 0, 0.08)"
    };
    transition: all 0.3s ease;
  `
      : `
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid rgba(6, 182, 212, 0.2);
  `}
`;

const TimelineHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const TimelineTitle = styled.span`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: #1e293b;
`;

const TimelineCount = styled.span`
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 500;
`;

const TimelineList = styled.div<{ $maxHeight: string }>`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: ${(props) => props.$maxHeight};
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

const TimelineItemStyled = styled.button<{
  $isActive: boolean;
  $isExpanded?: boolean;
}>`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: ${(props) => (props.$isExpanded ? "0.75rem" : "0.5rem 0.625rem")};
  background: ${(props) =>
    props.$isActive ? "rgba(6, 182, 212, 0.12)" : "white"};
  border: 1px solid
    ${(props) =>
      props.$isActive ? "rgba(6, 182, 212, 0.3)" : "rgba(0, 0, 0, 0.08)"};
  border-radius: ${(props) => (props.$isExpanded ? "10px" : "8px")};
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  width: 100%;

  &:hover {
    background: rgba(6, 182, 212, 0.08);
    border-color: rgba(6, 182, 212, 0.25);
    transform: translateX(4px);
  }

  &:active {
    transform: translateX(2px);
  }
`;

const MoreIndicator = styled.div`
  text-align: center;
  padding: 0.5rem;
  color: #0891b2;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    color: #06b6d4;
  }
`;

const TimelineTime = styled.span`
  font-family: "SF Mono", "Monaco", "Inconsolata", "Fira Mono", monospace;
  font-size: 0.8rem;
  font-weight: 600;
  color: #0891b2;
  background: rgba(6, 182, 212, 0.12);
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  white-space: nowrap;
  min-width: 52px;
  text-align: center;
`;

const TimelineLabel = styled.span`
  font-size: 0.85rem;
  color: #334155;
  line-height: 1.4;
  flex: 1;
`;

const ActiveIndicator = styled.span`
  font-size: 0.7rem;
  color: #0891b2;
  background: rgba(6, 182, 212, 0.15);
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  animation: pulse 1.5s ease-in-out infinite;
  white-space: nowrap;

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

function Timeline({
  podcastKey,
  currentTime,
  onTimeClick,
  items,
  variant = "default",
  maxHeight = "300px",
  showHeader = true,
  showActiveIndicator = false,
  maxItems,
  isExpanded = true,
}: TimelineProps) {
  const { timeline: fetchedTimeline } = useTimelineData(
    items ? undefined : podcastKey
  );
  const timeline = items || fetchedTimeline;
  const listRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

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

  const activeIndex = getActiveTimelineIndex();

  // 활성 항목으로 자동 스크롤 (펼침 상태일 때만)
  useEffect(() => {
    if (isExpanded && activeIndex >= 0 && itemRefs.current[activeIndex]) {
      itemRefs.current[activeIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [activeIndex, isExpanded]);

  if (timeline.length === 0) {
    return null;
  }

  // 표시할 항목 결정
  const displayItems =
    maxItems && !isExpanded ? timeline.slice(0, maxItems) : timeline;
  const hasMore = maxItems && !isExpanded && timeline.length > maxItems;

  return (
    <TimelineContainer $variant={variant} $isExpanded={isExpanded}>
      {showHeader && (
        <TimelineHeader>
          <TimelineTitle>📋 타임라인</TimelineTitle>
          <TimelineCount>{timeline.length}개 항목</TimelineCount>
        </TimelineHeader>
      )}
      <TimelineList ref={listRef} $maxHeight={isExpanded ? maxHeight : "auto"}>
        {displayItems.map((item, index) => {
          const isActive = activeIndex === index;
          return (
            <TimelineItemStyled
              key={index}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              $isActive={isActive}
              $isExpanded={isExpanded}
              onClick={() => onTimeClick(item.time)}
            >
              <TimelineTime>{formatTimelineTime(item.time)}</TimelineTime>
              <TimelineLabel>{item.label}</TimelineLabel>
              {showActiveIndicator && isActive && (
                <ActiveIndicator>재생 중</ActiveIndicator>
              )}
            </TimelineItemStyled>
          );
        })}
        {hasMore && (
          <MoreIndicator>+{timeline.length - maxItems!}개 더보기</MoreIndicator>
        )}
      </TimelineList>
    </TimelineContainer>
  );
}

export default Timeline;
