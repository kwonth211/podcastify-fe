export interface PodcastFile {
  key: string;
  date: string;
  size?: number;
  lastModified?: Date;
}

export interface AudioPlayerProps {
  audioUrl: string;
  date: string;
  title?: string;
  onDownload?: () => void;
}

