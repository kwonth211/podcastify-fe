import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { HelmetProvider } from "react-helmet-async";
import GlobalStyle from "./styles/GlobalStyle";
import { PlayerProvider } from "./contexts/PlayerContext";
import PodcastList from "./components/PodcastList";
import TranscriptPage from "./components/TranscriptPage";
import GlobalMiniPlayer from "./components/GlobalMiniPlayer";
import InstallPrompt from "./components/InstallPrompt";

const theme = {
  colors: {
    primary: "#667eea",
    secondary: "#764ba2",
    background: "#f5f7fa",
    text: "#333",
    textLight: "#666",
  },
};

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider theme={theme}>
        <PlayerProvider>
          <BrowserRouter>
            <GlobalStyle />
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <PodcastList />
                    <InstallPrompt />
                  </>
                }
              />
              <Route path="/transcript/:key" element={<TranscriptPage />} />
            </Routes>
            <GlobalMiniPlayer />
          </BrowserRouter>
        </PlayerProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
