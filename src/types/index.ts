export interface PodcastFile {
  key: string;
  date: string;
  size?: number;
  lastModified?: Date;
  duration?: number; // 오디오 길이 (초)
  playCount?: number; // 재생 횟수
}

export interface AudioPlayerProps {
  audioUrl: string;
  date: string;
  title?: string;
  duration?: number;
  onDownload?: () => void;
  podcastKey?: string; // 팟캐스트 키 (재생 횟수 추적용)
  playCount?: number; // 재생 횟수
  onPlayCountUpdate?: (count: number) => void; // 재생 횟수 업데이트 콜백
  triggerPlay?: number; // 재생 트리거 (값이 변경되면 재생)
  initialSeekTime?: number; // 초기 시작 시간 (초)
}
