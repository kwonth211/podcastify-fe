import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

interface PlayerState {
  podcastKey: string | null;
  audioUrl: string | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackRate: number;
  seekTime: number | null; // 타임라인 클릭 시 이동할 시간
}

interface PlayerContextType {
  playerState: PlayerState;
  playPodcast: (key: string, url: string, seekTime?: number) => void;
  stopPodcast: () => void;
  updateCurrentTime: (time: number) => void;
  updateDuration: (duration: number) => void;
  updatePlaybackRate: (rate: number) => void;
  setIsPlaying: (playing: boolean) => void;
  clearSeekTime: () => void;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [playerState, setPlayerState] = useState<PlayerState>({
    podcastKey: null,
    audioUrl: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    playbackRate: 1,
    seekTime: null,
  });

  const playPodcast = useCallback(
    (key: string, url: string, seekTime?: number) => {
      setPlayerState((prev) => ({
        podcastKey: key,
        audioUrl: url,
        isPlaying: true,
        currentTime: prev.podcastKey === key ? prev.currentTime : 0,
        duration: prev.podcastKey === key ? prev.duration : 0,
        playbackRate: prev.podcastKey === key ? prev.playbackRate : 1,
        seekTime: seekTime ?? null,
      }));
    },
    []
  );

  const stopPodcast = useCallback(() => {
    setPlayerState({
      podcastKey: null,
      audioUrl: null,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      playbackRate: 1,
      seekTime: null,
    });
  }, []);

  const updateCurrentTime = useCallback((time: number) => {
    setPlayerState((prev) => ({ ...prev, currentTime: time }));
  }, []);

  const updateDuration = useCallback((duration: number) => {
    setPlayerState((prev) => ({ ...prev, duration }));
  }, []);

  const updatePlaybackRate = useCallback((rate: number) => {
    setPlayerState((prev) => ({ ...prev, playbackRate: rate }));
  }, []);

  const setIsPlaying = useCallback((playing: boolean) => {
    setPlayerState((prev) => ({ ...prev, isPlaying: playing }));
  }, []);

  const clearSeekTime = useCallback(() => {
    setPlayerState((prev) => ({ ...prev, seekTime: null }));
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        playerState,
        playPodcast,
        stopPodcast,
        updateCurrentTime,
        updateDuration,
        updatePlaybackRate,
        setIsPlaying,
        clearSeekTime,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
}
