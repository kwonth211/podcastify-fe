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
  title: string;
  isPlaying: boolean;
  currentTime: number;
}

interface PlayerContextType {
  playerState: PlayerState;
  playPodcast: (
    key: string,
    url: string,
    title: string,
    seekTime?: number
  ) => void;
  stopPodcast: () => void;
  updateCurrentTime: (time: number) => void;
  setIsPlaying: (playing: boolean) => void;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [playerState, setPlayerState] = useState<PlayerState>({
    podcastKey: null,
    audioUrl: null,
    title: "",
    isPlaying: false,
    currentTime: 0,
  });

  const playPodcast = useCallback(
    (key: string, url: string, title: string, seekTime?: number) => {
      setPlayerState({
        podcastKey: key,
        audioUrl: url,
        title,
        isPlaying: true,
        currentTime: seekTime || 0,
      });
    },
    []
  );

  const stopPodcast = useCallback(() => {
    setPlayerState({
      podcastKey: null,
      audioUrl: null,
      title: "",
      isPlaying: false,
      currentTime: 0,
    });
  }, []);

  const updateCurrentTime = useCallback((time: number) => {
    setPlayerState((prev) => ({ ...prev, currentTime: time }));
  }, []);

  const setIsPlaying = useCallback((playing: boolean) => {
    setPlayerState((prev) => ({ ...prev, isPlaying: playing }));
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        playerState,
        playPodcast,
        stopPodcast,
        updateCurrentTime,
        setIsPlaying,
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
