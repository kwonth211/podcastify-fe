import { usePlayer } from "../contexts/PlayerContext";
import MiniPlayer from "./MiniPlayer";

function GlobalMiniPlayer() {
  const { playerState, stopPodcast, updateCurrentTime, clearSeekTime } =
    usePlayer();

  if (!playerState.audioUrl || !playerState.podcastKey) {
    return null;
  }

  const handleClose = () => {
    stopPodcast();
    // URL에서 playerId 제거
    const url = new URL(window.location.href);
    url.searchParams.delete("playerId");
    window.history.pushState({}, "", url.toString());
  };

  const handleSeekComplete = () => {
    clearSeekTime();
  };

  return (
    <MiniPlayer
      audioUrl={playerState.audioUrl}
      podcastKey={playerState.podcastKey}
      onClose={handleClose}
      initialSeekTime={playerState.seekTime ?? undefined}
      onTimeUpdate={updateCurrentTime}
      onSeekComplete={handleSeekComplete}
    />
  );
}

export default GlobalMiniPlayer;
