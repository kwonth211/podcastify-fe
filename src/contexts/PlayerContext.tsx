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
  seekTime: number | null; // 타임라인 클릭 시 이동할 시간
}

interface PlayerContextType {
  playerState: PlayerState;
  playPodcast: (key: string, url: string, seekTime?: number) => void;
  stopPodcast: () => void;
  updateCurrentTime: (time: number) => void;
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
    seekTime: null,
  });

  const playPodcast = useCallback(
    (key: string, url: string, seekTime?: number) => {
      setPlayerState((prev) => ({
        podcastKey: key,
        audioUrl: url,
        isPlaying: true,
        currentTime: prev.podcastKey === key ? prev.currentTime : 0,
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
      seekTime: null,
    });
  }, []);

  const updateCurrentTime = useCallback((time: number) => {
    setPlayerState((prev) => ({ ...prev, currentTime: time }));
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
