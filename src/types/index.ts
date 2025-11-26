export interface PodcastFile {
  key: string;
  date: string;
  size?: number;
  lastModified?: Date;
  duration?: number; // 오디오 길이 (초)
}

export interface AudioPlayerProps {
  audioUrl: string;
  date: string;
  title?: string;
  duration?: number;
  onDownload?: () => void;
}
